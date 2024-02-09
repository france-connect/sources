import { Body, Controller, Get, Headers, Post, Req, Res } from '@nestjs/common';

import { validateDto } from '@fc/common';
import { validationOptions } from '@fc/config';
import {
  BridgeError,
  BridgeProtocol,
  BridgeResponse,
  MessageType,
} from '@fc/hybridge-http-proxy';
import { LoggerService } from '@fc/logger';

import { BridgeHttpProxyErrorDto, BridgeHttpProxyResponseDto } from '../dto';
import { BridgeHttpProxyRoutes } from '../enums';
import {
  BridgeHttpProxyCsmrException,
  BridgeHttpProxyMissingVariableException,
} from '../exceptions';
import { BridgeHttpProxyService } from '../services';

@Controller()
export class BridgeHttpProxyController {
  constructor(
    private readonly logger: LoggerService,
    private readonly broker: BridgeHttpProxyService,
  ) {}

  /**
   * Catch all 'GET' routes needed for a cinematic
   * * /.well-known/openid-configuration
   * * /authorize
   * * /userinfo
   * * /jwks
   *
   * @param { originalUrl, method } from req
   * @param headers
   * @param res
   */
  @Get(BridgeHttpProxyRoutes.WILDCARD)
  async get(@Req() req, @Headers() headers, @Res() res): Promise<void> {
    await this.allRequest(req, headers, res);
  }

  /**
   * Catch all 'POST' routes needed for a cinematic
   * * /token
   *
   * @param { originalUrl, method } from req
   * @param headers
   * @param body
   * @param res
   */
  @Post(BridgeHttpProxyRoutes.WILDCARD)
  async post(
    @Req() req,
    @Headers() headers,
    @Res() res,
    @Body() body: string,
  ): Promise<void> {
    await this.allRequest(req, headers, res, body);
  }

  private async allRequest(req, headers, res, body?: string): Promise<void> {
    const { originalUrl, method } = req;
    const { host, 'x-forwarded-proto': xForwardedProto } = headers;

    this.logger.info(`${method} ${xForwardedProto}://${host}${originalUrl}`);

    const response: BridgeProtocol<object> = await this.broker.proxyRequest(
      originalUrl,
      method,
      headers,
      body,
    );

    const { type, data } = response;

    if (type === MessageType.DATA) {
      await this.handleMessage(res, data);
    } else {
      await this.handleError(data);
    }
  }

  async handleMessage(res, message: object) {
    const dtoProtocolErrors = await validateDto(
      message,
      BridgeHttpProxyResponseDto,
      validationOptions,
    );
    if (dtoProtocolErrors.length) {
      throw new BridgeHttpProxyMissingVariableException();
    }

    const { headers, data, status } = message as BridgeResponse;

    // set headers with headers return by idp through csmr-rie
    this.broker.setHeaders(res, headers);

    res.status(status).send(data);
  }

  async handleError(error: object) {
    const dtoProtocolErrors = await validateDto(
      error,
      BridgeHttpProxyErrorDto,
      validationOptions,
    );
    if (dtoProtocolErrors.length) {
      throw new BridgeHttpProxyMissingVariableException();
    }

    throw new BridgeHttpProxyCsmrException(error as BridgeError);
  }
}
