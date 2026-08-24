import { createPrivateKey, KeyObject } from 'crypto';

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
import {
  exportJWK,
  importJWK,
  JWK,
  JWTHeaderParameters,
  JWTPayload,
  SignJWT,
} from 'jose';

import { Injectable } from '@nestjs/common';

import { ArrayAsyncHelper } from '@fc/common';
import { ConfigService } from '@fc/config';
import { KekAlg, Use } from '@fc/cryptography';
import { JwkHelper, JwksDto, JwtService } from '@fc/jwt';

import { X509_CLIENT_ID_SCHEMES } from '../constants';
import { Openid4vpConfig } from '../dto';
import { loadX509SigningMaterial } from '../helpers';
import { VerifyJwtJwtInterface, X509SigningMaterial } from '../interfaces';
import { CONFIG_NAMESPACE } from '../tokens';

@Injectable()
export class Openid4vpCryptoService {
  private jwks: JwksDto;

  private x509SigningMaterial: X509SigningMaterial;

  private privateKey: KeyObject;

  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  onModuleInit() {
    const openid4vpConfig = this.config.get<Openid4vpConfig>(CONFIG_NAMESPACE);

    this.jwks = openid4vpConfig.jwks;

    if (this.isX509ClientIdScheme()) {
      this.x509SigningMaterial = loadX509SigningMaterial(
        openid4vpConfig.x509.certificateChainPem,
        openid4vpConfig.x509.privateKeyPem,
        openid4vpConfig.x509.alg,
      );

      this.privateKey = createPrivateKey({
        key: this.x509SigningMaterial.privateKeyPem,
        format: 'pem',
      });
    }
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

  getX509ClientId(): string {
    return this.x509SigningMaterial.clientIdHash;
  }

  async getJwtSigner(): Promise<JwtSigner> {
    if (this.isX509ClientIdScheme()) {
      return this.getX509Signer();
    }

    return await this.getJwkSigner();
  }

  private getX509Signer(): JwtSigner {
    return {
      method: 'x5c',
      x5c: this.x509SigningMaterial.x5c,
      alg: this.x509SigningMaterial.alg,
    };
  }

  private async getJwkSigner(): Promise<JwtSigner> {
    const signKey = this.jwt.getFirstRelevantKey(this.jwks, Use.SIG);
    const publicJwk = await JwkHelper.publicFromPrivate(signKey as JWK);

    return {
      method: 'jwk',
      publicJwk: publicJwk as Jwk,
      alg: signKey.alg,
    };
  }

  async signJwt(
    signer: JwtSigner,
    jwt: { payload: JWTPayload; header: JWTHeaderParameters },
  ): Promise<ReturnType<SignJwtCallback>> {
    if (signer.method === 'x5c') {
      return await this.signJwtWithX5c(signer, jwt);
    }

    return await this.signJwtWithJwk(signer, jwt);
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

  private isX509ClientIdScheme(): boolean {
    const { relayingParty } =
      this.config.get<Openid4vpConfig>(CONFIG_NAMESPACE);

    return X509_CLIENT_ID_SCHEMES.includes(relayingParty.clientIdScheme);
  }

  private async signJwtWithJwk(
    signer: JwtSigner,
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
      signerJwk: (signer as { publicJwk: Jwk }).publicJwk,
    };
  }

  private async signJwtWithX5c(
    signer: JwtSigner,
    jwt: { payload: JWTPayload; header: JWTHeaderParameters },
  ): Promise<ReturnType<SignJwtCallback>> {
    const publicJwk = await exportJWK(
      this.x509SigningMaterial.leafCertificate.publicKey,
    );

    const compactJwt = await new SignJWT(jwt.payload)
      .setProtectedHeader(jwt.header)
      .sign(this.privateKey);

    return {
      jwt: compactJwt,
      signerJwk: publicJwk as Jwk,
    };
  }
}
