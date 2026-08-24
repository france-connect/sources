import {
  createLocalJWKSet,
  decodeJwt,
  decodeProtectedHeader,
  JSONWebKeySet,
  jwtVerify,
} from 'jose';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { DekAlg, Use } from '@fc/cryptography';
import { JwtService } from '@fc/jwt';

import { AppConfig } from '../dto';
import {
  MockWalletInvalidRequestObjectHeaderException,
  MockWalletInvalidSignatureException,
  MockWalletJarmEncryptionException,
  MockWalletMissingTrustedJwksException,
} from '../exceptions';
import { RequestObjectPayload, WalletResponsePayload } from '../interfaces';

@Injectable()
export class MockWalletCryptoService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  decodeProtectedHeader(jwt: string): Record<string, unknown> {
    try {
      return decodeProtectedHeader(jwt) as Record<string, unknown>;
    } catch (error) {
      throw new MockWalletInvalidRequestObjectHeaderException(error);
    }
  }

  decodePayload(jwt: string): unknown {
    return decodeJwt(jwt);
  }

  async verifySignature(jwt: string): Promise<void> {
    const { trustedJwks } = this.config.get<AppConfig>('App');

    if (!trustedJwks) {
      throw new MockWalletMissingTrustedJwksException();
    }

    const jwks = createLocalJWKSet(trustedJwks as unknown as JSONWebKeySet);

    try {
      await jwtVerify(jwt, jwks);
    } catch (error) {
      throw new MockWalletInvalidSignatureException(error);
    }
  }

  async encryptJarm(
    responsePayload: WalletResponsePayload,
    request: RequestObjectPayload,
  ): Promise<string> {
    const metadata = (request.client_metadata || {}) as Record<string, unknown>;

    const encoding = metadata.authorization_encrypted_response_enc as DekAlg;
    const jwks = (metadata.jwks || { keys: [] }) as JSONWebKeySet;

    const payload = JSON.stringify({
      state: responsePayload.state,
      vp_token: responsePayload.vp_token,
      presentation_submission: responsePayload.presentation_submission,
    });

    try {
      const encryptionKey = this.jwt.getFirstRelevantKey(jwks, Use.ENC);

      return await this.jwt.encrypt(payload, encryptionKey, encoding);
    } catch (error) {
      throw new MockWalletJarmEncryptionException(error);
    }
  }
}
