import type {
  DecryptJweCallback,
  DecryptJweCallbackOptions,
  EncryptJweCallback,
  Jwk,
  JwkSet,
  JwtSigner,
  SignJwtCallback,
  VerifyJwtCallback,
} from '@openid4vc/oauth2';
import {
  CreateOpenid4vpAuthorizationRequestOptions,
  ParseOpenid4vpAuthorizationResponseOptions,
} from '@openid4vc/openid4vp';
import { importJWK, JWK, JWTHeaderParameters, JWTPayload, SignJWT } from 'jose';

import { Injectable } from '@nestjs/common';

import { ArrayAsyncHelper } from '@fc/common';
import { ConfigService } from '@fc/config';
import { KekAlg, Use } from '@fc/cryptography';
import { JwkHelper, JwksDto, JwtService } from '@fc/jwt';

import { Openid4vpConfig } from '../dto';
import { JwtSignerInterface, VerifyJwtJwtInterface } from '../interfaces';
import { CONFIG_NAMESPACE } from '../tokens';

@Injectable()
export class Openid4vpCryptoService {
  private jwks: JwksDto;

  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  onModuleInit() {
    this.jwks = this.config.get<Openid4vpConfig>(CONFIG_NAMESPACE).jwks;
  }

  readonly requestCallbacks: CreateOpenid4vpAuthorizationRequestOptions['callbacks'] =
    {
      signJwt: this.signJwt.bind(this),
      encryptJwe: this.encryptJwe.bind(this),
    };

  readonly responseCallbacks: ParseOpenid4vpAuthorizationResponseOptions['callbacks'] =
    {
      decryptJwe: this.decryptJwe.bind(this),
      verifyJwt: this.verifyJwt.bind(this),
    };

  async getJwtSigner(): Promise<JwtSigner> {
    const signKey = this.jwt.getFirstRelevantKey(this.jwks, Use.SIG);

    const publicJwk = await JwkHelper.publicFromPrivate(signKey as JWK);

    return {
      method: 'jwk',
      publicJwk: publicJwk as Jwk,
      alg: signKey.alg,
    };
  }

  async signJwt(
    signer: JwtSignerInterface,
    jwt: { payload: JWTPayload; header: JWTHeaderParameters },
  ): Promise<ReturnType<SignJwtCallback>> {
    const jwk = this.jwt.getFirstRelevantKey(
      this.jwks,
      Use.SIG,
      signer.alg as KekAlg,
    );

    const key = await importJWK(jwk as JWK, signer.alg);
    const compactJwt = await new SignJWT(jwt.payload)
      .setProtectedHeader(jwt.header)
      .sign(key);

    return {
      jwt: compactJwt,
      signerJwk: signer.publicJwk as Jwk,
    };
  }

  async verifyJwt(
    signer: JwtSigner,
    jwt: VerifyJwtJwtInterface,
  ): Promise<ReturnType<VerifyJwtCallback>> {
    const {
      payload: { iss },
      header: { jwk },
      compact,
    } = jwt;

    const jwks = { keys: [jwk] };

    await this.jwt.verify(compact, iss, jwks);

    return {
      verified: true,
      signerJwk: jwk as Jwk,
    };
  }

  async encryptJwe(): Promise<ReturnType<EncryptJweCallback>> {
    return await Promise.reject(
      new Error('OID4VP JAR/JARM encryption callback is not configured yet.'),
    );
  }

  async decryptJwe(
    payload: string,
    { jwk }: DecryptJweCallbackOptions,
  ): Promise<ReturnType<DecryptJweCallback>> {
    const decryptedToken = await this.jwt.decrypt(payload, this.jwks);

    return {
      decrypted: true,
      decryptionJwk: jwk,
      payload: decryptedToken,
    };
  }

  async getPublicJwks(): Promise<JwkSet> {
    const publicKeys = await ArrayAsyncHelper.mapAsync(
      this.jwks.keys,
      async (key) => {
        const publicJwk = await JwkHelper.publicFromPrivate(key as JWK);
        return { ...publicJwk };
      },
    );

    const publicJwks = {
      keys: publicKeys,
    };

    return publicJwks;
  }
}
