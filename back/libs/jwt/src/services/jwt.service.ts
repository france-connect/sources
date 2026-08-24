import { AxiosResponse } from 'axios';
import { instanceToPlain } from 'class-transformer';
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
import { lastValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { validateDto } from '@fc/common';
import { DekAlg, KekAlg, Use } from '@fc/cryptography';
import { FetchJwksFailedException } from '@fc/jwt/exceptions/fetch-jwks-failed.exception';
import { LoggerService } from '@fc/logger';

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
  ) {}

  getFirstRelevantKey(
    jwks: JSONWebKeySet | JwksDto,
    use: Use,
    alg?: KekAlg,
    kid?: string,
  ): JWK {
    const relevantKeys = jwks.keys
      .filter((jwk: JWK) => jwk.use === use)
      .filter((jwk: JWK) => (alg ? jwk.alg === alg : true))
      .filter((jwk: JWK) => (kid ? jwk.kid === kid : true));

    if (relevantKeys.length === 0) {
      throw new NoRelevantKeyException(alg, use);
    } else if (relevantKeys.length > 1 && kid) {
      throw new MultipleRelevantKeysException(alg, use, kid);
    }

    const [key] = relevantKeys;

    return key as JWK;
  }

  getKeyForToken(jwt: string, jwks: JSONWebKeySet, use: Use): JWK {
    const headers = this.retrieveJwtHeaders(jwt);

    const alg = headers.alg as KekAlg;
    const kid = headers.kid;

    const key = this.getFirstRelevantKey(jwks, use, alg, kid);

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

  async decrypt(jwt: string, jwks: JSONWebKeySet | JwksDto): Promise<string> {
    const jwk = this.getKeyForToken(jwt, jwks as JSONWebKeySet, Use.ENC);

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
    const key = await this.importJwk(jwk);
    const { alg, kid } = jwk;

    let jwt: string;
    const protectedHeader = kid ? { alg, kid } : { alg };

    try {
      jwt = await new SignJWT(payload)
        .setProtectedHeader(protectedHeader)
        .setIssuedAt()
        .setIssuer(issuer)
        .setAudience(audience)
        .sign(key);
    } catch (error) {
      throw new CanNotSignJwtException(error);
    }

    return jwt;
  }

  async verify(
    jwt: string,
    issuer: string,
    jwks: JSONWebKeySet | JwksDto,
  ): Promise<JWTPayload> {
    const jwk = this.getKeyForToken(jwt, jwks as JSONWebKeySet, Use.SIG);

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
      const plainJwk = instanceToPlain(jwk) as JWK;
      key = await importJWK(plainJwk);
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
