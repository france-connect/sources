import { KeyLike as NativeKeyLike } from 'crypto';

import { AxiosResponse } from 'axios';
import {
  base64url,
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
} from 'jose';
import { lastValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';

import { validateDto } from '@fc/common';
import { DekAlg, KekAlg, Use } from '@fc/cryptography';
import { FetchJwksFailedException } from '@fc/jwt/exceptions/fetch-jwks-failed.exception';
import { LoggerService } from '@fc/logger';
import {
  SIGN_ADAPTER_TOKEN,
  SignAdapterServiceInterface,
} from '@fc/sign-adapter';

import { JwksDto } from '../dto';
import {
  CanNotDecodePlaintextException,
  CanNotDecodeProtectedHeaderException,
  CanNotDecryptException,
  CanNotEncryptException,
  CanNotImportJwkException,
  CanNotSignJwtException,
  InvalidJwksException,
  InvalidSignatureException,
  NoRelevantKeyException,
} from '../exceptions';
import { MultipleRelevantKeysException } from '../exceptions/multiple-relevant-keys.exception';

@Injectable()
export class JwtService {
  constructor(
    private readonly http: HttpService,
    private readonly logger: LoggerService,
    @Inject(SIGN_ADAPTER_TOKEN)
    private readonly signAdapter: SignAdapterServiceInterface,
  ) {}

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

  async sign(
    payload: JWTPayload,
    issuer: string,
    audience: string,
    jwk: JWK,
  ): Promise<string> {
    let jwt: string;

    try {
      const { alg } = jwk;

      const encodedHeader = this.buildSignedHeader(jwk);
      const encodedPayload = this.buildSignedPayload(payload, issuer, audience);
      const signingInput = `${encodedHeader}.${encodedPayload}`;

      const key = await this.importJwk(jwk);
      const signature = await this.signAdapter.sign(
        signingInput,
        alg,
        key as NativeKeyLike,
      );
      const encodedSig = base64url.encode(signature);

      jwt = `${signingInput}.${encodedSig}`;
    } catch (error) {
      throw new CanNotSignJwtException(error);
    }

    return jwt;
  }

  private buildSignedHeader(jwk: JWK): string {
    const { alg, kid } = jwk;

    const protectedHeader = kid ? { alg, kid } : { alg };
    const encodedHeader = base64url.encode(JSON.stringify(protectedHeader));

    return encodedHeader;
  }

  private buildSignedPayload(
    payload: JWTPayload,
    issuer: string,
    audience: string,
  ): string {
    const now = Math.floor(Date.now() / 1000);
    const body = { ...payload, iss: issuer, aud: audience, iat: now };

    const encodedPayload = base64url.encode(JSON.stringify(body));

    return encodedPayload;
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

  async fetchJwks(url: string): Promise<JSONWebKeySet> {
    let response: AxiosResponse<JSONWebKeySet>;

    try {
      response = await lastValueFrom(this.http.get(url));
    } catch (error) {
      throw new FetchJwksFailedException(error);
    }
    const errors = await validateDto(response.data, JwksDto, {});
    if (errors.length > 0) {
      this.logger.debug(errors, 'The JWKS format is invalid');
      throw new InvalidJwksException();
    }

    return response.data as JSONWebKeySet;
  }
}
