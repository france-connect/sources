import { createOpenid4vpAuthorizationRequest } from '@openid4vc/openid4vp';
import { v4 as uuid } from 'uuid';

import { Injectable } from '@nestjs/common';

import { parameterizedPath } from '@fc/common';
import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { SessionService } from '@fc/session';

import {
  Openid4vpConfig,
  Openid4vpInteractionDto,
  Openid4vpRequestConfig,
} from '../dto';
import { Openid4vpInteractionStatus } from '../enums';
import {
  AuthorizationRequestObjectInterface,
  AuthorizationRequestPayload,
} from '../interfaces';
import { CONFIG_NAMESPACE } from '../tokens';
import { Openid4vpCryptoService } from './openid4vp-crypto.service';

@Injectable()
export class Openid4vpRequestService {
  constructor(
    private readonly config: ConfigService,
    private readonly openid4vpCrypto: Openid4vpCryptoService,
    private readonly crypto: CryptographyService,
    private readonly session: SessionService,
  ) {}

  getAuthorizeRequestUri(interaction: Openid4vpInteractionDto): string {
    const { relayingParty } =
      this.config.get<Openid4vpConfig>(CONFIG_NAMESPACE);

    const request = this.getRequestById(interaction.presentationId);

    const requestUri = parameterizedPath(relayingParty.requestUri, {
      interactionId: interaction.id,
    });

    const url = new URL('openid4vp://authorize');
    url.searchParams.set('client_id', relayingParty.clientId);
    url.searchParams.set('request_uri', requestUri);
    url.searchParams.set('response_type', request.responseType);

    return url.toString();
  }

  getRequestById(presentationId: string): Openid4vpRequestConfig | undefined {
    const { requests } = this.config.get<Openid4vpConfig>(CONFIG_NAMESPACE);

    const request = requests.find(
      (request) => request.presentationId === presentationId,
    );

    return request;
  }

  generateInteractionParams(presentationId: string): Openid4vpInteractionDto {
    const { relayingParty } =
      this.config.get<Openid4vpConfig>(CONFIG_NAMESPACE);

    const sessionId = this.session.getId();
    const now = Math.floor(Date.now() / 1000);

    return {
      id: uuid(),
      presentationId,
      state: this.crypto.genRandomString(relayingParty.stateLength),
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
  ): Promise<AuthorizationRequestPayload> {
    const { relayingParty } =
      this.config.get<Openid4vpConfig>(CONFIG_NAMESPACE);

    const urlParams = {
      interactionId: interaction.id,
    };

    const authorizationRequestPayload: AuthorizationRequestPayload = {
      iat: interaction.iat,
      exp: interaction.exp,
      state: interaction.state,
      nonce: interaction.nonce,

      /**
       * @todo #2622 change by a more secure client_id_scheme
       */
      client_id_scheme: relayingParty.clientIdScheme,
      client_id: parameterizedPath(relayingParty.clientId, urlParams),
      response_uri: parameterizedPath(relayingParty.responseUri, urlParams),
      redirect_uri: parameterizedPath(relayingParty.redirectUri, urlParams),
      request_uri: parameterizedPath(relayingParty.requestUri, urlParams),
      response_type: request.responseType,
      response_mode: request.responseMode,

      client_metadata: {
        vp_formats: relayingParty.clientMetadata.formats,
        token_endpoint_auth_method:
          relayingParty.clientMetadata.token_endpoint_auth_method,
        authorization_encrypted_response_alg:
          relayingParty.clientMetadata.authorization_encrypted_response_alg,
        authorization_encrypted_response_enc:
          relayingParty.clientMetadata.authorization_encrypted_response_enc,
        jwks: await this.openid4vpCrypto.getPublicJwks(),
      },
      presentation_definition: {
        id: request.presentationId,
        input_descriptors: [
          {
            id: request.inputDescriptorId,
            format: relayingParty.clientMetadata.formats,
            constraints: {
              limit_disclosure: 'required',
              fields: this.generateConstraintFields(
                request.inputFieldPaths,
                request.inputFieldPurpose,
                request.inputFieldIntentToRetain,
              ),
            },
          },
        ],
      },
    };

    return authorizationRequestPayload;
  }

  async createAuthorizeRequestObject(
    interaction: Openid4vpInteractionDto,
    request: Openid4vpRequestConfig,
  ): Promise<AuthorizationRequestObjectInterface> {
    const { relayingParty } =
      this.config.get<Openid4vpConfig>(CONFIG_NAMESPACE);

    const authorizationRequestPayload =
      await this.createAuthorizationRequestPayload(interaction, request);

    const requestObject = await createOpenid4vpAuthorizationRequest({
      authorizationRequestPayload,
      callbacks: this.openid4vpCrypto.requestCallbacks,
      jar: {
        requestUri: parameterizedPath(relayingParty.requestUri, {
          interactionId: interaction.id,
        }),
        jwtSigner: await this.openid4vpCrypto.getJwtSigner(),
        expiresInSeconds: relayingParty.interactionTtl,
      },
    });

    return requestObject;
  }

  private generateConstraintField(
    path: string,
    purpose: string,
    intentToRetain: boolean,
  ) {
    return {
      path: [path],
      purpose,
      intent_to_retain: intentToRetain,
    };
  }

  private generateConstraintFields(
    paths: string[],
    purpose: string,
    intentToRetain: boolean,
  ) {
    return paths.map((path) =>
      this.generateConstraintField(path, purpose, intentToRetain),
    );
  }
}
