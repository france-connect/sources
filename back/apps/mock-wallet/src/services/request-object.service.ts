import { Injectable } from '@nestjs/common';

import { getValidDto, nowInSeconds } from '@fc/common';
import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import {
  AppConfig,
  RequestObjectHeaderDto,
  RequestObjectPayloadDto,
} from '../dto';
import {
  MockWalletClientIdMismatchException,
  MockWalletInvalidJarException,
  MockWalletInvalidRequestObjectHeaderException,
  MockWalletInvalidRequestObjectPayloadException,
  MockWalletJarFetchException,
} from '../exceptions';
import { ParsedDeepLink } from '../interfaces';
import { MockWalletCryptoService } from './mock-wallet-crypto.service';

const JAR_CONTENT_TYPE = 'application/oauth-authz-req+jwt';

@Injectable()
export class RequestObjectService {
  constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
    private readonly crypto: MockWalletCryptoService,
  ) {}

  async fetch(requestUri: string): Promise<string> {
    const { httpTimeoutMs, permissiveContentType } =
      this.config.get<AppConfig>('App');

    const response = await this.safeHttpGet(requestUri, httpTimeoutMs);

    this.checkContentType(response, permissiveContentType);

    const jwt = await response.text();

    this.checkIsCompactJws(jwt);

    return jwt;
  }

  async validate(
    jwt: string,
    deepLink: ParsedDeepLink,
  ): Promise<RequestObjectPayloadDto> {
    const { skipSignatureVerification } = this.config.get<AppConfig>('App');

    if (!skipSignatureVerification) {
      await this.crypto.verifySignature(jwt);
    }

    await this.checkHeader(this.crypto.decodeProtectedHeader(jwt));

    const payload = this.crypto.decodePayload(jwt);
    const dto = await this.validatePayload(payload);

    this.checkCorrelation(dto, deepLink);

    return dto;
  }

  private async checkHeader(header: Record<string, unknown>): Promise<void> {
    try {
      await getValidDto(header, RequestObjectHeaderDto, { whitelist: false });
    } catch (error) {
      throw new MockWalletInvalidRequestObjectHeaderException(error);
    }
  }

  async validatePayload(payload: unknown): Promise<RequestObjectPayloadDto> {
    let validatedPayload: RequestObjectPayloadDto;

    try {
      validatedPayload = await getValidDto(payload, RequestObjectPayloadDto, {
        whitelist: false,
      });
    } catch (error) {
      throw new MockWalletInvalidRequestObjectPayloadException(error);
    }

    this.checkTiming(validatedPayload);

    return validatedPayload;
  }

  private checkTiming(payload: RequestObjectPayloadDto): void {
    const now = nowInSeconds();

    const isExpired = payload.exp <= now;
    const isNbfFuture = this.isFutureClaim(payload.nbf, now);
    const isIatFuture = this.isFutureClaim(payload.iat, now);

    if (isExpired || isNbfFuture || isIatFuture) {
      throw new MockWalletInvalidRequestObjectPayloadException();
    }
  }

  private isFutureClaim(claim: number | undefined, now: number): boolean {
    return claim !== undefined && claim > now;
  }

  private checkContentType(
    response: Response,
    permissiveContentType: boolean,
  ): void {
    const contentType = response.headers.get('content-type') ?? '';

    if (permissiveContentType || contentType.includes(JAR_CONTENT_TYPE)) {
      return;
    }

    throw new MockWalletJarFetchException(
      `Unexpected Request Object content-type: ${contentType}`,
    );
  }

  private async safeHttpGet(url: string, timeoutMs: number): Promise<Response> {
    try {
      return await this.httpGet(url, timeoutMs);
    } catch (error) {
      throw new MockWalletJarFetchException(error);
    }
  }

  private checkCorrelation(
    payload: RequestObjectPayloadDto,
    deepLink: ParsedDeepLink,
  ): void {
    if (deepLink.clientId !== payload.client_id) {
      throw new MockWalletClientIdMismatchException();
    }
  }

  private checkIsCompactJws(jwt: string): void {
    const segments = jwt.split('.');

    if (
      segments.length !== 3 ||
      segments.some((segment) => Boolean(segment) === false)
    ) {
      throw new MockWalletInvalidJarException();
    }
  }

  private async httpGet(url: string, timeoutMs: number): Promise<Response> {
    return await fetch(url, {
      headers: { Accept: JAR_CONTENT_TYPE },
      redirect: 'manual',
      signal: AbortSignal.timeout(timeoutMs),
    });
  }
}
