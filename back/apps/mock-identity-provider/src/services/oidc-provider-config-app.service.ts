import { IncomingMessage } from 'http';

import { Injectable } from '@nestjs/common';

import { LoggerService } from '@fc/logger-legacy';
import {
  OidcProviderAppConfigLibService,
  OidcProviderErrorService,
  OidcProviderGrantService,
} from '@fc/oidc-provider';
import { SessionService } from '@fc/session';

import { AppSession } from '../dto';
import { ScenariosService } from './scenarios.service';

@Injectable()
export class OidcProviderConfigAppService extends OidcProviderAppConfigLibService {
  // Dependency injection can require more than 4 parameters
  // eslint-disable-next-line max-params
  constructor(
    protected readonly logger: LoggerService,
    protected readonly sessionService: SessionService,
    protected readonly errorService: OidcProviderErrorService,
    protected readonly grantService: OidcProviderGrantService,
    private readonly scenarios: ScenariosService,
  ) {
    super(logger, sessionService, errorService, grantService);
  }

  protected async formatAccount(sessionId, spIdentity, subSp) {
    const req = {
      sessionId,
      sessionService: this.sessionService,
    } as unknown as IncomingMessage;

    const appSession = SessionService.getBoundedSession<AppSession>(req, 'App');

    const userLogin = await appSession.get('userLogin');

    const claims = this.scenarios.deleteClaims(userLogin, spIdentity, subSp);

    return {
      /**
       * We used the `sessionId` as `accountId` identifier when building the grant
       * @see OidcProviderService.finishInteraction()
       */
      accountId: sessionId,
      async claims() {
        return claims;
      },
    };
  }
}
