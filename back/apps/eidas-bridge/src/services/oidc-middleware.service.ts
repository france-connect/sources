import { Injectable } from '@nestjs/common';

import { LoggerService } from '@fc/logger';
import { OidcSession } from '@fc/oidc';
import {
  OidcProviderMiddlewareStep,
  OidcProviderRoutes,
  OidcProviderService,
} from '@fc/oidc-provider';
import { ServiceProviderAdapterEnvService } from '@fc/service-provider-adapter-env';
import { ISessionBoundContext, SessionService } from '@fc/session';

@Injectable()
export class OidcMiddlewareService {
  constructor(
    private readonly logger: LoggerService,
    private readonly oidcProvider: OidcProviderService,
    private readonly serviceProvider: ServiceProviderAdapterEnvService,
    private readonly sessionService: SessionService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async onModuleInit() {
    this.oidcProvider.registerMiddleware(
      OidcProviderMiddlewareStep.AFTER,
      OidcProviderRoutes.AUTHORIZATION,
      this.authorizationMiddleware.bind(this),
    );
  }

  private async authorizationMiddleware(ctx) {
    /**
     * Abort middleware if authorize is in error
     *
     * We do not want to start a session
     * nor trigger authorization event for invalid requests
     */
    if (ctx.oidc['isError'] === true) {
      return;
    }

    const { sessionId } = ctx.req;
    const interactionId = this.oidcProvider.getInteractionIdFromCtx(ctx);

    // Store the binding relation between interactionId >> sessionId.
    await this.sessionService.setAlias(interactionId, sessionId);

    // oidc defined variable name
    const { client_id: spId, acr_values: spAcr } = ctx.oidc.params;

    const { name: spName } = await this.serviceProvider.getById(spId);

    const sessionProperties: OidcSession = {
      interactionId,
      spId,
      spAcr,
      spName,
    };

    const boundSessionContext: ISessionBoundContext = {
      sessionId,
      moduleName: 'OidcClient',
    };

    const saveWithContext = this.sessionService.set.bind(
      this.sessionService,
      boundSessionContext,
    );
    await saveWithContext(sessionProperties);
  }
}
