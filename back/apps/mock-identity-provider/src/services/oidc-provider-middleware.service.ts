import { Injectable } from '@nestjs/common';

import { throwException } from '@fc/exceptions/helpers';
import {
  OidcCtx,
  OidcProviderMiddlewarePattern,
  OidcProviderMiddlewareStep,
  OidcProviderRoutes,
  OidcProviderService,
} from '@fc/oidc-provider';
import { SessionNotFoundException, SessionService } from '@fc/session';
import { TrackedEventContextInterface } from '@fc/tracking';

import { AppSession } from '../dto';
import { ScenariosService } from './scenarios.service';

@Injectable()
export class OidcProviderMiddlewareService {
  constructor(
    private readonly oidcProvider: OidcProviderService,
    private readonly scenarios: ScenariosService,
    private readonly session: SessionService,
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
    const sessionId = ctx.oidc.entities.Account.accountId;
    let session: { App: AppSession };

    try {
      session = await this.session.getDataFromBackend<{ App: AppSession }>(
        sessionId,
      );
    } catch (error) {
      return await throwException(new SessionNotFoundException('App'));
    }

    const {
      App: { userLogin },
    } = session;

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
      ctx.oidc?.entities?.Account?.accountId || this.session.getId();

    const eventContext: TrackedEventContextInterface = {
      fc: { interactionId },
      req: ctx.req,
      sessionId,
    };

    return eventContext;
  }
}
