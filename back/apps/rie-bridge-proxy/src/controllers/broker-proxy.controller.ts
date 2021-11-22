import { Body, Controller, Get, Headers, Post, Req } from '@nestjs/common';

import { LoggerService } from '@fc/logger';

import { RieBridgeProxyRoutes } from '../enums';

@Controller()
export class BrokerProxyController {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(this.constructor.name);
  }

  /**
   * Catch all 'GET' routes needed for a cinematic
   * * /.well-known/openid-configuration
   * * /authorize
   * * /userinfo
   * * /jwks
   * @returns string | JSON
   */
  @Get(RieBridgeProxyRoutes.WILDCARD)
  async get(@Req() { url }: { url: string }, @Body() body, @Headers() headers) {
    this.logger.debug(`GET ${url}`);
    this.logger.trace(`REQ.body ===========\n${JSON.stringify(body, null, 2)}`);
    this.logger.trace(
      `Headers ============\n${JSON.stringify(headers, null, 2)}`,
    );

    /* @TODO : to remove when #739 will be implement
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/739
     */
    const mockPartialWellKnownResponse = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      authorization_endpoint:
        'https://auth.llng.docker.dev-franceconnect.fr/oauth2/authorize',
    };

    return mockPartialWellKnownResponse;
  }

  /**
   * Catch all 'POST' routes needed for a cinematic
   * * /token
   * @returns string | JSON
   */
  @Post(RieBridgeProxyRoutes.WILDCARD)
  async post(
    @Req() { url }: { url: string },
    @Body() body,
    @Headers() headers,
  ) {
    this.logger.debug(`POST ${url}`);
    this.logger.trace(`REQ.body ===========\n${JSON.stringify(body, null, 2)}`);
    this.logger.trace(
      `Headers ============\n${JSON.stringify(headers, null, 2)}`,
    );

    /* @TODO : to remove when #739 will be implement
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/739
     */
    const mockResponse = { status: 200, message: 'ok' };

    return mockResponse;
  }
}
