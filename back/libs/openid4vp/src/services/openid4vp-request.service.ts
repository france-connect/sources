import { createOpenid4vpAuthorizationRequest } from '@openid4vc/openid4vp';

import { Injectable } from '@nestjs/common';

import { parameterizedPath } from '@fc/common';
import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { DcqlQueryInterface, DcqlService } from '@fc/dcql';
import { SessionService } from '@fc/session';

import { X509_CLIENT_ID_SCHEMES } from '../constants';
import {
  Openid4vpConfig,
  Openid4vpInteractionDto,
  Openid4vpRequestConfig,
} from '../dto';
import { Openid4vpFlow, Openid4vpInteractionStatus } from '../enums';
import {
  AuthorizationRequestObjectInterface,
  AuthorizationRequestPayload,
} from '../interfaces';
import { CONFIG_NAMESPACE } from '../tokens';
import { Openid4vpCryptoService } from './openid4vp-crypto.service';

@Injectable()
export class Openid4vpRequestService {
  // allowed for DI
  // eslint-disable-next-line max-params
  constructor(
    private readonly config: ConfigService,
    private readonly openid4vpCrypto: Openid4vpCryptoService,
    private readonly crypto: CryptographyService,
    private readonly session: SessionService,
    private readonly dcql: DcqlService,
  ) {}

  getAuthorizeRequestUri(
    interaction: Openid4vpInteractionDto,
    flow: Openid4vpFlow,
  ): string {
    const { relayingParty } =
      this.config.get<Openid4vpConfig>(CONFIG_NAMESPACE);

    const request = this.getRequestById(interaction.credentialQueryId);

    if (!request) {
      throw new Error(
        `No OpenID4VP request configuration matches credentialQueryId "${interaction.credentialQueryId}"`,
      );
    }

    const stateValue = this.getFlowState(flow, interaction);

    const requestUri = parameterizedPath(relayingParty.requestUri, {
      interactionId: interaction.id,
      state: stateValue,
    });

    const url = new URL('openid4vp://authorize');
    url.searchParams.set('client_id', this.resolveClientId(interaction));
    url.searchParams.set('request_uri', requestUri);
    url.searchParams.set('response_type', request.responseType);

    return url.toString();
  }

  getRequestById(
    credentialQueryId: string,
  ): Openid4vpRequestConfig | undefined {
    const { requests } = this.config.get<Openid4vpConfig>(CONFIG_NAMESPACE);

    const request = requests.find(
      (request) => request.credentialQueryId === credentialQueryId,
    );

    return request;
  }

  generateInteractionParams(
    id: string,
    credentialQueryId: string,
  ): Openid4vpInteractionDto {
    const { relayingParty } =
      this.config.get<Openid4vpConfig>(CONFIG_NAMESPACE);

    const sessionId = this.session.getId();
    const now = Math.floor(Date.now() / 1000);

    return {
      id,
      credentialQueryId,
      state: {
        sameDevice: this.crypto.genRandomString(relayingParty.stateLength),
        crossDevice: this.crypto.genRandomString(relayingParty.stateLength),
      },
      nonce: this.crypto.genRandomString(relayingParty.nonceLength),
      iat: now,
      exp: now + relayingParty.interactionTtl,
      status: Openid4vpInteractionStatus.REQUEST_URI_PROVIDED,
      sessionId,
    };
  }

  async createAuthorizationRequestPayload(
    interaction: Openid4vpInteractionDto,
    request: Openid4vpRequestConfig,
    flow: Openid4vpFlow,
  ): Promise<AuthorizationRequestPayload> {
    const { relayingParty } =
      this.config.get<Openid4vpConfig>(CONFIG_NAMESPACE);

    const stateValue = this.getFlowState(flow, interaction);

    const urlParams = {
      interactionId: interaction.id,
      state: stateValue,
    };

    const authorizationRequestPayload: AuthorizationRequestPayload = {
      iat: interaction.iat,
      exp: interaction.exp,
      state: stateValue,
      nonce: interaction.nonce,

      /**
       * @todo #2622 change by a more secure client_id_scheme
       */
      client_id_scheme: relayingParty.clientIdScheme,
      client_id: this.resolveClientId(interaction),
      response_uri: parameterizedPath(relayingParty.responseUri, urlParams),
      request_uri: parameterizedPath(relayingParty.requestUri, urlParams),
      response_type: request.responseType,
      response_mode: request.responseMode,

      client_metadata: {
        vp_formats_supported: relayingParty.clientMetadata.formats,
        token_endpoint_auth_method:
          relayingParty.clientMetadata.token_endpoint_auth_method,
        authorization_encrypted_response_alg:
          relayingParty.clientMetadata.authorization_encrypted_response_alg,
        authorization_encrypted_response_enc:
          relayingParty.clientMetadata.authorization_encrypted_response_enc,
        jwks: await this.openid4vpCrypto.getPublicJwks(),
      },
      ...this.buildAttributeQuery(request),
    };

    return authorizationRequestPayload;
  }

  async createAuthorizeRequestObject(
    interaction: Openid4vpInteractionDto,
    request: Openid4vpRequestConfig,
    flow: Openid4vpFlow,
  ): Promise<AuthorizationRequestObjectInterface> {
    const { relayingParty } =
      this.config.get<Openid4vpConfig>(CONFIG_NAMESPACE);

    const authorizationRequestPayload =
      await this.createAuthorizationRequestPayload(interaction, request, flow);

    const requestObject = await createOpenid4vpAuthorizationRequest({
      authorizationRequestPayload,
      callbacks: this.openid4vpCrypto.requestCallbacks,
      jar: {
        requestUri: parameterizedPath(relayingParty.requestUri, {
          interactionId: interaction.id,
          state: this.getFlowState(flow, interaction),
        }),
        jwtSigner: await this.openid4vpCrypto.getJwtSigner(),
        expiresInSeconds: relayingParty.interactionTtl,
      },
    });

    return requestObject;
  }

  private getFlowState(
    flow: Openid4vpFlow,
    interaction: Openid4vpInteractionDto,
  ): string {
    return flow === Openid4vpFlow.SAME_DEVICE
      ? interaction.state.sameDevice
      : interaction.state.crossDevice;
  }

  private resolveClientId(interaction: Openid4vpInteractionDto): string {
    const { relayingParty } =
      this.config.get<Openid4vpConfig>(CONFIG_NAMESPACE);

    if (X509_CLIENT_ID_SCHEMES.includes(relayingParty.clientIdScheme)) {
      return this.openid4vpCrypto.getX509ClientId();
    }

    return parameterizedPath(relayingParty.clientId, {
      interactionId: interaction.id,
    });
  }

  private buildAttributeQuery(request: Openid4vpRequestConfig): {
    readonly dcql_query: DcqlQueryInterface;
  } {
    return { dcql_query: this.buildDcqlQuery(request) };
  }

  private buildDcqlQuery(request: Openid4vpRequestConfig): DcqlQueryInterface {
    return this.dcql.buildMdocQuery({
      id: request.credentialQueryId,
      doctype: request.inputDescriptorId,
      requiredPaths: request.inputFieldRequiredPaths,
      optionalPaths: request.inputFieldOptionalPaths,
      intentToRetain: request.inputFieldIntentToRetain,
    });
  }
}
