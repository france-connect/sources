import { Injectable } from '@nestjs/common';

import {
  OidcCtx,
  OidcProviderMiddlewarePattern,
  OidcProviderMiddlewareStep,
  OidcProviderRoutes,
  OidcProviderService,
} from '@fc/oidc-provider';
import { SessionService } from '@fc/session';
import { TrackedEventContextInterface } from '@fc/tracking';

import { AppSession } from '../dto';
import { ScenariosService } from './scenarios.service';

@Injectable()
export class OidcProviderMiddlewareService {
  // Dependency injection can require more than 4 parameters
  // eslint-disable-next-line max-params
  constructor(
    private readonly oidcProvider: OidcProviderService,
    private readonly scenarios: ScenariosService,
  ) {}

  onModuleInit() {
    this.registerMiddleware(
      OidcProviderMiddlewareStep.AFTER,
      OidcProviderRoutes.USERINFO,
      this.userinfoMiddleware,
    );
  }

  protected registerMiddleware(
    step: OidcProviderMiddlewareStep,
    pattern: OidcProviderMiddlewarePattern | OidcProviderRoutes,
    middleware: Function,
  ) {
    this.oidcProvider.registerMiddleware(step, pattern, middleware.bind(this));
  }

  protected async userinfoMiddleware(ctx: OidcCtx) {
    this.bindSessionId(ctx);

    const appSessionService = SessionService.getBoundSession<AppSession>(
      ctx.req,
      'App',
    );
    const userLogin = await appSessionService.get('userLogin');

    await this.scenarios.alterServerResponse(userLogin, ctx);
  }

  /**
   * @todo refactor this method in `@fc/oidc-provider`
   */
  protected getEventContext(ctx: OidcCtx): TrackedEventContextInterface {
    const interactionId: string =
      this.oidcProvider.getInteractionIdFromCtx(ctx);

    // Retrieve the sessionId from the oidc context (stored in accountId) or from the request
    const sessionId =
      ctx.oidc?.entities?.Account?.accountId || ctx.req.sessionId;

    const eventContext: TrackedEventContextInterface = {
      fc: { interactionId },
      req: ctx.req,
      sessionId,
    };

    return eventContext;
  }

  private bindSessionId(ctx: OidcCtx): void {
    const context = this.getEventContext(ctx);

    ctx.req.sessionId = context.sessionId;
  }
}
