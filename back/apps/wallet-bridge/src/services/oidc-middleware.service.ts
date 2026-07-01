import { Response } from 'express';

import { Injectable } from '@nestjs/common';

import {
  OidcCtx,
  OidcProviderMiddlewareStep,
  OidcProviderRoutes,
  OidcProviderService,
} from '@fc/oidc-provider';
import { SessionService } from '@fc/session';

@Injectable()
export class OidcMiddlewareService {
  constructor(
    private readonly oidcProvider: OidcProviderService,
    private readonly sessionService: SessionService,
  ) {}

  /**
   * @TODO #2632 Additional middlewares will be required when wiring the EUDI wallet interaction
   */
  onApplicationBootstrap() {
    this.oidcProvider.registerMiddleware(
      OidcProviderMiddlewareStep.AFTER,
      OidcProviderRoutes.USERINFO,
      this.afterUserinfoMiddleware.bind(this),
    );
  }

  private async afterUserinfoMiddleware({ res }: OidcCtx) {
    await this.sessionService.destroy(res as unknown as Response);
  }
}
