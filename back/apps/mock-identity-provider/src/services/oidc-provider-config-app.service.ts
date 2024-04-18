import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import { IOidcIdentity, stringToArray } from '@fc/oidc';
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
    protected readonly config: ConfigService,
    private readonly scenarios: ScenariosService,
  ) {
    super(logger, sessionService, errorService, grantService, config);
  }

  // Needed for consistent typing
  // eslint-disable-next-line require-await
  protected async formatAccount(
    sessionId: string,
    spIdentity: Partial<IOidcIdentity>,
    subSp: string,
  ): Promise<{ accountId: string; claims: Function }> {
    const { userLogin } = this.sessionService.get<AppSession>('App');

    const claims = this.scenarios.deleteClaims(userLogin, spIdentity, subSp);

    // openid like property names
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { rep_scope = '' } = claims;
    const repScopeArray = stringToArray(rep_scope);

    if (repScopeArray.length > 0) {
      // openid like property names
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Object.assign(claims, { rep_scope: repScopeArray });
    } else {
      delete claims.rep_scope;
    }

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
