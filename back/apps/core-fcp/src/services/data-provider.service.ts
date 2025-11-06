import { ValidatorOptions } from 'class-validator';

import { HttpStatus, Injectable } from '@nestjs/common';

import { validateDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import {
  ChecktokenRequestDto,
  DpJwtPayloadInterface,
  ErrorParamsDto,
  InvalidChecktokenRequestException,
  TokenIntrospectionInterface,
} from '@fc/core';
import { Use } from '@fc/cryptography';
import { CryptographyFcpService } from '@fc/cryptography-fcp';
import { DataProviderMetadata } from '@fc/data-provider-adapter-mongo';
import { JwtService } from '@fc/jwt';
import { AccessToken, atHashFromAccessToken, stringToArray } from '@fc/oidc';
import { OidcProviderConfig, OidcProviderService } from '@fc/oidc-provider';
import { OidcProviderRedisAdapter } from '@fc/oidc-provider/adapters';
import { RedisService } from '@fc/redis';
import { RnippPivotIdentity } from '@fc/rnipp';
import { SessionService } from '@fc/session';

import { CoreFcpSession } from '../dto';

@Injectable()
export class DataProviderService {
  // OidcProviderRedisAdapter
  // Rule override allowed for dependency injection
  // eslint-disable-next-line max-params
  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
    private readonly redis: RedisService,
    private readonly session: SessionService,
    private readonly cryptographyFcp: CryptographyFcpService,
    private readonly oidcProvider: OidcProviderService,
  ) {}

  async checkRequestValid(
    checktokenRequest: ChecktokenRequestDto,
  ): Promise<void> {
    const validatorOptions: ValidatorOptions = {
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    };

    const errors = await validateDto(
      checktokenRequest,
      ChecktokenRequestDto,
      validatorOptions,
    );
    if (errors.length > 0) {
      throw new InvalidChecktokenRequestException();
    }
  }

  async generateJwt(
    tokenIntrospection: TokenIntrospectionInterface,
    dataProvider: DataProviderMetadata,
  ): Promise<string> {
    const payload: DpJwtPayloadInterface = {
      token_introspection: tokenIntrospection,
    };

    const jws = await this.generateJws(payload, dataProvider);
    const jwe = await this.generateJwe(jws, dataProvider);

    return jwe;
  }

  async getSessionByAccessToken(
    accessToken: string,
  ): Promise<CoreFcpSession | null> {
    const atHash = atHashFromAccessToken({ jti: accessToken });
    const sessionId = await this.session.getAlias(atHash);

    if (!sessionId) {
      return null;
    }

    return await this.session.getDataFromBackend<CoreFcpSession>(sessionId);
  }

  async generateTokenIntrospection(
    userSession: CoreFcpSession,
    accessToken: string,
    dataProvider: DataProviderMetadata,
  ): Promise<TokenIntrospectionInterface> {
    /**
     * We can not use DI for this adapter since it was made to be instantiated by `oidc-provider`
     * It requires a ServiceProviderAdapter that we won't use here
     * and the `context` parameter which is a string, not a provider.
     */
    const adapter = new OidcProviderRedisAdapter(
      this.redis,
      undefined,
      'AccessToken',
    );

    const { expire, payload: interaction } =
      await adapter.getExpireAndPayload<AccessToken>(accessToken);

    if (expire <= 0 || !userSession) {
      return this.generateExpiredResponse();
    }

    return this.generateValidResponse(dataProvider, userSession, interaction);
  }

  generateExpiredResponse(): TokenIntrospectionInterface {
    return { active: false };
  }

  generateErrorMessage(
    httpStatusCode: number,
    message: string,
    error: string,
  ): ErrorParamsDto {
    if (httpStatusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      return {
        error: 'server_error',
        error_description:
          'The authorization server encountered an unexpected condition that prevented it from fulfilling the request.',
      };
    }

    return {
      error,
      error_description: message,
    };
  }

  private generateValidResponse(
    dataProvider: DataProviderMetadata,
    userSession: CoreFcpSession,
    interaction: AccessToken,
  ): TokenIntrospectionInterface {
    const {
      claims: {
        id_token: {
          acr: { values: acrValues },
        },
      },
      iat,
      exp,
      jti,
      clientId: spClientId,
    } = interaction;

    const {
      OidcClient: { rnippIdentity },
    } = userSession;

    const dpSub = this.generateDataProviderSub(
      rnippIdentity,
      dataProvider.client_id,
    );
    // Limit scopes returned to prevent data provider from learning more about the network than necessary.
    // @see https://www.rfc-editor.org/rfc/rfc7662.html#section-2.2
    const authorizedScopes = this.filterScopes(
      dataProvider.scopes,
      interaction.scope,
    );

    return {
      active: true,
      aud: spClientId,
      sub: dpSub,
      iat,
      exp,
      acr: acrValues.join(' '),
      jti,
      scope: authorizedScopes.join(' '),
      ...rnippIdentity,
    };
  }

  private filterScopes(
    dataProviderScopes: string[],
    interactionScope: string,
  ): string[] {
    return stringToArray(interactionScope).filter((requestedScope: string) =>
      dataProviderScopes.includes(requestedScope),
    );
  }

  private generateDataProviderSub(
    identity: RnippPivotIdentity,
    clientId: string,
  ): string {
    const identityHash = this.cryptographyFcp.computeIdentityHash(identity);
    return this.cryptographyFcp.computeSubV1(clientId, identityHash);
  }

  private async generateJws(
    payload: DpJwtPayloadInterface,
    dataProvider: DataProviderMetadata,
  ): Promise<string> {
    const { issuer } = this.config.get<OidcProviderConfig>('OidcProvider');

    const signingKey = this.getSigningKey(dataProvider);

    const jws = await this.jwt.sign(
      payload,
      issuer,
      dataProvider.client_id,
      signingKey,
    );

    return jws;
  }

  private getSigningKey(dataProvider: DataProviderMetadata) {
    const { checktoken_signed_response_alg: signingAlgorithm } = dataProvider;

    const jwks = this.oidcProvider.getJwks();

    const signingKey = this.jwt.getFirstRelevantKey(
      jwks,
      signingAlgorithm,
      Use.SIG,
    );

    return signingKey;
  }

  private async generateJwe(
    jwt: string,
    dataProvider: DataProviderMetadata,
  ): Promise<string> {
    const {
      checktoken_encrypted_response_alg: encryptionAlgorithm,
      checktoken_encrypted_response_enc: encryptionEncoding,
    } = dataProvider;

    const jwks = await this.jwt.fetchJwks(dataProvider.jwks_uri);

    const encryptionKey = this.jwt.getFirstRelevantKey(
      jwks,
      encryptionAlgorithm,
      Use.ENC,
    );

    const jwe = await this.jwt.encrypt(jwt, encryptionKey, encryptionEncoding);

    return jwe;
  }
}
