import {
  compactDecrypt,
  CompactEncrypt,
  decodeProtectedHeader,
  importJWK,
  JSONWebKeySet,
  JWK,
  JWTPayload,
  jwtVerify,
  JWTVerifyResult,
  KeyLike,
  ProtectedHeaderParameters,
  SignJWT,
} from 'jose';

import { Injectable } from '@nestjs/common';

import { DekAlg, KekAlg, Use } from '@fc/cryptography';

import {
  CanNotDecodePlaintextException,
  CanNotDecodeProtectedHeaderException,
  CanNotDecryptException,
  CanNotEncryptException,
  CanNotImportJwkException,
  CanNotSignJwtException,
  InvalidSignatureException,
  NoRelevantKeyException,
} from '../exceptions';
import { MultipleRelevantKeysException } from '../exceptions/multiple-relevant-keys.exception';

@Injectable()
export class JwtService {
  constructor() {}

  getFirstRelevantKey(
    jwks: JSONWebKeySet,
    alg: KekAlg,
    use: Use,
    kid?: string,
  ): JWK {
    const relevantKeys = jwks.keys
      .filter((jwk: JWK) => jwk.use === use)
      .filter((jwk: JWK) => jwk.alg === alg)
      .filter((jwk: JWK) => (kid ? jwk.kid === kid : true));

    if (relevantKeys.length === 0) {
      throw new NoRelevantKeyException(alg, use);
    } else if (relevantKeys.length > 1 && kid) {
      throw new MultipleRelevantKeysException(alg, use, kid);
    }

    const [key] = relevantKeys;

    return key;
  }

  getKeyForToken(jwt: string, jwks: JSONWebKeySet, use: Use): JWK {
    const headers = this.retrieveJwtHeaders(jwt);

    const alg = headers.alg as KekAlg;
    const kid = headers.kid;

    const key = this.getFirstRelevantKey(jwks, alg, use, kid);

    return key;
  }

  async encrypt(payload: string, jwk: JWK, encoding: DekAlg): Promise<string> {
    const { alg } = jwk;

    const key = await this.importJwk(jwk);

    const input = new TextEncoder().encode(payload);

    let encryptedJwt: string;

    try {
      encryptedJwt = await new CompactEncrypt(input)
        .setProtectedHeader({ alg, enc: encoding })
        .encrypt(key);
    } catch (error) {
      throw new CanNotEncryptException(error);
    }

    return encryptedJwt;
  }

  async decrypt(jwt: string, jwks: JSONWebKeySet): Promise<string> {
    const jwk = this.getKeyForToken(jwt, jwks, Use.ENC);

    const key = await this.importJwk(jwk);

    let plaintext: Uint8Array;
    try {
      ({ plaintext } = await compactDecrypt(jwt, key));
    } catch (error) {
      throw new CanNotDecryptException(error);
    }

    let clearToken: string;
    try {
      clearToken = new TextDecoder().decode(plaintext);
    } catch (error) {
      throw new CanNotDecodePlaintextException(error);
    }

    return clearToken;
  }

  async sign(payload: JWTPayload, issuer: string, jwk: JWK): Promise<string> {
    const key = await this.importJwk(jwk);
    const { alg } = jwk;

    let jwt: string;

    try {
      jwt = await new SignJWT(payload)
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setIssuer(issuer)
        .sign(key);
    } catch (error) {
      throw new CanNotSignJwtException(error);
    }

    return jwt;
  }

  async verify(
    jwt: string,
    issuer: string,
    jwks: JSONWebKeySet,
  ): Promise<JWTPayload> {
    const jwk = this.getKeyForToken(jwt, jwks, Use.SIG);

    const key = await this.importJwk(jwk);

    let data: JWTVerifyResult;

    try {
      data = await jwtVerify(jwt, key, { issuer });
    } catch (error) {
      throw new InvalidSignatureException(error);
    }

    return data.payload;
  }

  retrieveJwtHeaders(jwt: string): ProtectedHeaderParameters {
    try {
      const headers = decodeProtectedHeader(jwt);
      return headers;
    } catch (error) {
      throw new CanNotDecodeProtectedHeaderException(error);
    }
  }

  private async importJwk(jwk: JWK): Promise<Uint8Array | KeyLike> {
    let key: Uint8Array | KeyLike;
    try {
      key = await importJWK(jwk);
    } catch (error) {
      throw new CanNotImportJwkException(error);
    }

    return key;
  }
}
