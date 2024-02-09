import { AxiosError, AxiosResponse } from 'axios';
import { JSONWebKeySet, JWTPayload } from 'jose';
import { stringify } from 'qs';
import { lastValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { DekAlg, KekAlg } from '@fc/cryptography';
import { JwtService } from '@fc/jwt';

import { DataProviderAdapterCoreConfig } from './dto';
import {
  ChecktokenHttpStatusException,
  ChecktokenInvalidAlgorithmException,
  ChecktokenInvalidEncodingException,
  ChecktokenTimeoutException,
  JwksFetchFailedException,
} from './exceptions';

@Injectable()
export class DataProviderAdapterCoreService {
  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService,
    private readonly jwt: JwtService,
  ) {}

  async checktoken(accessToken: string): Promise<JWTPayload> {
    let cryptedToken: any;

    try {
      ({ data: cryptedToken } = await this.fetchToken(accessToken));
    } catch (error) {
      this.checktokenHttpError(error);
    }

    const { checktokenEncryptedResponseAlg, checktokenEncryptedResponseEnc } =
      this.config.get<DataProviderAdapterCoreConfig>('DataProviderAdapterCore');

    this.checkEncryptAlgorithm(cryptedToken, checktokenEncryptedResponseAlg);
    this.checkEncryptEncoding(cryptedToken, checktokenEncryptedResponseEnc);

    const claims = await this.getDecryptedAndVerifiedToken(cryptedToken);

    return claims;
  }

  private async fetchToken(
    accessToken: string,
  ): Promise<Pick<AxiosResponse, 'data' | 'status'>> {
    // Based on oidc standard
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { client_id, client_secret, checktokenEndpoint } =
      this.config.get<DataProviderAdapterCoreConfig>('DataProviderAdapterCore');
    const checktokenRequest = {
      // Based on oidc standard
      // eslint-disable-next-line @typescript-eslint/naming-convention
      client_id,
      // Based on oidc standard
      // eslint-disable-next-line @typescript-eslint/naming-convention
      client_secret,
      // Based on oidc standard
      // eslint-disable-next-line @typescript-eslint/naming-convention
      access_token: accessToken,
    };

    const { status, data } = await lastValueFrom<AxiosResponse<string>>(
      this.http.post(checktokenEndpoint, stringify(checktokenRequest), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        proxy: false,
      }),
    );

    return {
      status,
      data,
    };
  }

  private async getDecryptedAndVerifiedToken(
    token: string,
  ): Promise<JWTPayload> {
    // Grab needed parameters
    const {
      issuer,
      jwks: encryptJwks,
      jwksEndpoint,
    } = this.config.get<DataProviderAdapterCoreConfig>(
      'DataProviderAdapterCore',
    );
    const signJwks = await this.fetchSignKeys(jwksEndpoint);

    // Decrypt and verify token
    const signedToken = await this.jwt.decrypt(token, encryptJwks);
    const claims = await this.jwt.verify(signedToken, issuer, signJwks);

    return claims;
  }

  private async fetchSignKeys(url: string): Promise<JSONWebKeySet> {
    let response: AxiosResponse<JSONWebKeySet>;

    try {
      response = await lastValueFrom(
        this.http.get(url, {
          proxy: false,
        }),
      );
    } catch (error) {
      throw new JwksFetchFailedException(error);
    }

    return response.data as JSONWebKeySet;
  }

  private checktokenHttpError(
    // oidc compliant
    // eslint-disable-next-line @typescript-eslint/naming-convention
    error: AxiosError<{ error: string; error_description: string }>,
  ) {
    switch (error.code) {
      /**
       * At the moment Axios does not use "ETIMEOUT" like native
       * but "ECONNABORTED" @see https://github.com/axios/axios/pull/2874
       */
      case 'ETIMEDOUT':
      case 'ECONNABORTED':
      case 'ECONNRESET':
        throw new ChecktokenTimeoutException();
    }

    throw new ChecktokenHttpStatusException(error);
  }

  private checkEncryptAlgorithm(jwt: string, encryptAlgorithm: string): void {
    const headers = this.jwt.retrieveJwtHeaders(jwt);

    const alg = headers.alg as KekAlg;
    if (typeof alg !== 'string' || encryptAlgorithm !== alg) {
      throw new ChecktokenInvalidAlgorithmException();
    }
  }

  private checkEncryptEncoding(jwt: string, encryptEncoding: string): void {
    const headers = this.jwt.retrieveJwtHeaders(jwt);

    const enc = headers.enc as DekAlg;
    if (typeof enc !== 'string' || encryptEncoding !== enc) {
      throw new ChecktokenInvalidEncodingException();
    }
  }
}
