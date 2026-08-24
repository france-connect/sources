import { Injectable } from '@nestjs/common';

import { EudiPresentationId } from '@fc/eudi';
import {
  OidcCtx,
  OidcProviderMiddlewareStep,
  OidcProviderRoutes,
  OidcProviderService,
} from '@fc/oidc-provider';
import { Openid4vpService } from '@fc/openid4vp';

@Injectable()
export class OidcMiddlewareService {
  constructor(
    private readonly oidcProvider: OidcProviderService,
    private readonly openid4vp: Openid4vpService,
  ) {}

  /**
   * @TODO #2632 Additional middlewares will be required when wiring the EUDI wallet interaction
   */
  onApplicationBootstrap() {
    this.oidcProvider.registerMiddleware(
      OidcProviderMiddlewareStep.BEFORE,
      OidcProviderRoutes.AUTHORIZATION,
      this.beforeAuthorizationMiddleware.bind(this),
    );

    this.oidcProvider.registerMiddleware(
      OidcProviderMiddlewareStep.AFTER,
      OidcProviderRoutes.AUTHORIZATION,
      this.afterAuthorizationMiddleware.bind(this),
    );
  }

  private beforeAuthorizationMiddleware({ req, res }: OidcCtx): void {
    /**
     * Force cookies to be reset to prevent panva from keeping
     * a session open if you use several service provider in a row
     * @param ctx
     */
    this.oidcProvider.clearCookies(res);
    req.headers.cookie = '';
  }

  private async afterAuthorizationMiddleware(ctx: OidcCtx) {
    const interactionId = ctx.oidc.entities.Interaction.uid;

    const request = this.openid4vp.getRequestById(EudiPresentationId.PID_FC);

    await this.openid4vp.createAuthorizationRequest(interactionId, request);
  }
}
