import { AxiosResponse } from 'axios';
import { ValidatorOptions } from 'class-validator';
import { JSONWebKeySet } from 'jose';
import { lastValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';

import { validateDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import { Use } from '@fc/cryptography';
import { CryptographyFcpService } from '@fc/cryptography-fcp';
import {
  DataProviderAdapterMongoService,
  DataProviderMetadata,
} from '@fc/data-provider-adapter-mongo';
import { CustomJwtPayload, JwtService } from '@fc/jwt';
import { AccessToken, atHashFromAccessToken, stringToArray } from '@fc/oidc';
import { OidcClientSession } from '@fc/oidc-client';
import { OidcProviderConfig } from '@fc/oidc-provider';
import { OidcProviderRedisAdapter } from '@fc/oidc-provider/adapters';
import { RedisService } from '@fc/redis';
import { RnippPivotIdentity } from '@fc/rnipp';
import { ScopesService } from '@fc/scopes';
import { ISessionService, SessionService } from '@fc/session';

import { ChecktokenRequestDto, ErrorParamsDto } from '../dto';
import {
  CoreFcpFetchDataProviderJwksFailedException,
  InvalidChecktokenRequestException,
} from '../exceptions';
import { DpJwtPayloadInterface } from '../interfaces';

@Injectable()
export class DataProviderService {
  // OidcProviderRedisAdapter
  // Rule override allowed for dependency injection
  // eslint-disable-next-line max-params
  constructor(
    private readonly config: ConfigService,
    private readonly dataProvider: DataProviderAdapterMongoService,
    private readonly http: HttpService,
    private readonly jwt: JwtService,
    private readonly redis: RedisService,
    private readonly session: SessionService,
    private readonly cryptographyFcp: CryptographyFcpService,
    private readonly scopes: ScopesService,
  ) {}
  /**
   * This function take the checkTokenRequest to validate it
   * @param checktokenRequest checktoken of the request
   * @returns nothing
   * @throws InvalidChecktokenRequestException if the request body doesn't respect the DTO
   */
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
    payload: CustomJwtPayload<DpJwtPayloadInterface>,
    dataProviderId: string,
  ): Promise<string> {
    const dataProvider = await this.dataProvider.getByClientId(dataProviderId);

    const jws = await this.generateJws(payload, dataProvider);
    const jwe = await this.generateJwe(jws, dataProvider);

    return jwe;
  }

  async getSessionByAccessToken(accessToken: string): Promise<string> {
    const atHash = atHashFromAccessToken({ jti: accessToken });

    return await this.session.getAlias(atHash);
  }

  async generatePayload(
    oidcSessionService: ISessionService<OidcClientSession>,
    accessToken: string,
    dpClientId: string,
  ): Promise<CustomJwtPayload<DpJwtPayloadInterface>> {
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

    if (expire <= 0) {
      return this.generateExpiredPayload(dpClientId);
    }

    return this.generateValidPayload(
      dpClientId,
      oidcSessionService,
      interaction,
    );
  }

  generateExpiredPayload(aud: string): CustomJwtPayload<DpJwtPayloadInterface> {
    return {
      // OIDC defined var name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      token_introspection: {
        active: false,
      },
      aud,
    };
  }

  generateErrorMessage(
    httpStatusCode: number,
    message: string,
    error: string,
  ): ErrorParamsDto {
    if (httpStatusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      return {
        error: 'server_error',
        // oidc compliant
        // eslint-disable-next-line @typescript-eslint/naming-convention
        error_description:
          'The authorization server encountered an unexpected condition that prevented it from fulfilling the request.',
      };
    }

    return {
      error,
      // oidc compliant
      // eslint-disable-next-line @typescript-eslint/naming-convention
      error_description: message,
    };
  }

  private async generateValidPayload(
    dpClientId: string,
    oidcSessionService: ISessionService<OidcClientSession>,
    interaction: AccessToken,
  ): Promise<CustomJwtPayload<DpJwtPayloadInterface>> {
    const {
      claims: {
        id_token: {
          acr: { values: acr },
        },
      },
      iat,
      exp,
      jti,
      clientId: spClientId,
    } = interaction;

    const { rnippIdentity } = await oidcSessionService.get();
    const dpSub = this.generateDataProviderSub(rnippIdentity, dpClientId);

    const scope = await this.getDpRelatedScopes(dpClientId, interaction);

    const payload = {
      // OIDC defined var name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      token_introspection: {
        active: true,
        aud: spClientId,
        sub: dpSub,
        iat,
        exp,
        acr: acr.join(' '),
        jti,
        scope: scope.join(' '),
        ...rnippIdentity,
      },
      aud: dpClientId,
    };

    return payload;
  }

  private async getDpRelatedScopes(
    dpClientId: string,
    interaction: AccessToken,
  ): Promise<string[]> {
    const { slug } = await this.dataProvider.getByClientId(dpClientId);

    const { scope: interactionScopes } = interaction;

    const dataProviderScope = this.scopes.getScopesByDataProvider(slug);

    const dpRelatedScopes = stringToArray(interactionScopes).filter(
      (scope: string) => dataProviderScope.includes(scope),
    );

    return dpRelatedScopes;
  }

  private generateDataProviderSub(
    identity: RnippPivotIdentity,
    clientId: string,
  ): string {
    const identityHash = this.cryptographyFcp.computeIdentityHash(identity);
    return this.cryptographyFcp.computeSubV1(clientId, identityHash);
  }

  private async generateJws(
    payload: CustomJwtPayload<DpJwtPayloadInterface>,
    dataProvider: DataProviderMetadata,
  ): Promise<string> {
    const { checktoken_endpoint_auth_signing_alg: signAlgorithm } =
      dataProvider;

    const {
      issuer,
      configuration: { jwks: signJwks },
    } = this.config.get<OidcProviderConfig>('OidcProvider');

    const signKey = this.jwt.getFirstRelevantKey(
      signJwks as JSONWebKeySet, // Types are incompatible for now, @todo see if we can fix this without side effect
      signAlgorithm,
      Use.SIG,
    );
    const jws = await this.jwt.sign(payload, issuer, signKey);

    return jws;
  }

  private async generateJwe(
    jwt: string,
    dataProvider: DataProviderMetadata,
  ): Promise<string> {
    const {
      jwks_uri: dataProviderJwksUrl,
      checktoken_encrypted_response_alg: encryptAlgorithm,
      checktoken_encrypted_response_enc: encryptEncoding,
    } = dataProvider;

    const encryptJwks = await this.fetchEncryptionKeys(dataProviderJwksUrl);

    const encryptKey = this.jwt.getFirstRelevantKey(
      encryptJwks,
      encryptAlgorithm,
      Use.ENC,
    );

    const jwe = await this.jwt.encrypt(jwt, encryptKey, encryptEncoding);

    return jwe;
  }

  private async fetchEncryptionKeys(url: string): Promise<JSONWebKeySet> {
    let response: AxiosResponse<JSONWebKeySet>;

    try {
      response = await lastValueFrom(this.http.get(url));
    } catch (error) {
      throw new CoreFcpFetchDataProviderJwksFailedException(error);
    }

    return response.data as JSONWebKeySet;
  }
}
