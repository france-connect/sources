import { Body, Controller, Get, Headers, Post, Req, Res } from '@nestjs/common';

import { LoggerService } from '@fc/logger';

import { RieBridgeProxyRoutes } from '../enums';
import { BrokerProxyService } from '../services';

@Controller()
export class BrokerProxyController {
  constructor(
    private readonly logger: LoggerService,
    private readonly broker: BrokerProxyService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

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
  @Get(RieBridgeProxyRoutes.WILDCARD)
  async get(@Req() req, @Headers() headers, @Res() res): Promise<void> {
    const { originalUrl } = req;
    const { host, 'x-forwarded-proto': xForwardedProto } = headers;

    this.logger.debug(`GET ${xForwardedProto}://${host}${originalUrl}`);

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
  @Post(RieBridgeProxyRoutes.WILDCARD)
  async post(
    @Req() req,
    @Headers() headers,
    @Res() res,
    @Body() body: string,
  ): Promise<void> {
    const { originalUrl } = req;
    const { host, 'x-forwarded-proto': xForwardedProto } = headers;

    this.logger.debug(`POST ${xForwardedProto}://${host}${originalUrl}`);

    await this.allRequest(req, headers, res, body);
  }

  private async allRequest(req, headers, res, body?: string): Promise<void> {
    const { originalUrl, method } = req;

    const {
      headers: headerResponse,
      data,
      status: statusCode,
    } = await this.broker.proxyRequest(originalUrl, method, headers, body);

    // set headers with headers return by idp through csmr-rie
    this.broker.setHeaders(res, headerResponse);

    res.status(statusCode).send(data);
  }
}
