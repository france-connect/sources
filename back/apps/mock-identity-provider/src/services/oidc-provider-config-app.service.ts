import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import {
  OidcProviderAppConfigLibService,
  OidcProviderErrorService,
  OidcProviderGrantService,
} from '@fc/oidc-provider';
import { ISessionRequest, SessionService } from '@fc/session';

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
    protected readonly config: ConfigService,
    private readonly scenarios: ScenariosService,
  ) {
    super(logger, sessionService, errorService, grantService, config);
  }

  protected async formatAccount(sessionId, spIdentity, subSp) {
    const req = {
      sessionId,
      sessionService: this.sessionService,
    } as ISessionRequest;

    const appSession = SessionService.getBoundSession<AppSession>(req, 'App');

    const userLogin = await appSession.get('userLogin');

    const claims = this.scenarios.deleteClaims(userLogin, spIdentity, subSp);

    return {
      /**
       * We used the `sessionId` as `accountId` identifier when building the grant
       * @see OidcProviderService.finishInteraction()
       */
      accountId: sessionId,
      // compliant to oidc-provider spec
      // eslint-disable-next-line require-await
      async claims() {
        return claims;
      },
    };
  }
}
