import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';

import { AppConfig } from '../dto';
import {
  JarmPostBodyInterface,
  RequestObjectPayload,
  SubmitResult,
  VpTokenPostBodyInterface,
  WalletPostBodyType,
  WalletResponsePayload,
} from '../interfaces';
import { MockWalletCryptoService } from './mock-wallet-crypto.service';

const DIRECT_POST_JWT = 'direct_post.jwt';

@Injectable()
export class WalletResponseService {
  constructor(
    private readonly config: ConfigService,
    private readonly crypto: MockWalletCryptoService,
  ) {}

  async buildPostBody(
    responsePayload: WalletResponsePayload,
    request: RequestObjectPayload,
  ): Promise<JarmPostBodyInterface | VpTokenPostBodyInterface> {
    const stateParam = responsePayload.state
      ? { state: responsePayload.state }
      : {};

    if (request.response_mode === DIRECT_POST_JWT) {
      const response = await this.crypto.encryptJarm(responsePayload, request);

      return { ...stateParam, response };
    }

    return {
      ...stateParam,
      vp_token: responsePayload.vp_token,
      presentation_submission: JSON.stringify(
        responsePayload.presentation_submission,
      ),
    };
  }

  async post(
    responseUri: string,
    body: WalletPostBodyType,
  ): Promise<SubmitResult> {
    const { responseContentType, httpTimeoutMs } =
      this.config.get<AppConfig>('App');

    const entries = Object.entries(body).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string',
    );

    const response = await fetch(responseUri, {
      method: 'POST',
      headers: { 'content-type': responseContentType },
      body: new URLSearchParams(entries).toString(),
      redirect: 'manual',
      signal: AbortSignal.timeout(httpTimeoutMs),
    });

    const responseBody = await response.text();

    return {
      statusCode: response.status,
      responseBody,
      redirectUri: this.extractRedirectUri(responseBody),
    };
  }

  private extractRedirectUri(responseBody: string): string | undefined {
    try {
      const parsed = JSON.parse(responseBody) as { redirect_uri?: string };

      return parsed.redirect_uri;
    } catch {
      return undefined;
    }
  }
}
