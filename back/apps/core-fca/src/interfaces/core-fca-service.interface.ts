/* istanbul ignore file */

// Declarative file
import { Response } from 'express';

import { CoreAuthorizeParamsInterface, CoreServiceInterface } from '@fc/core';
import { OidcClientSession } from '@fc/oidc-client';
import { ISessionService } from '@fc/session';

export interface CoreFcaServiceInterface extends CoreServiceInterface {
  redirectToIdp: (
    res: Response,
    idpId: string,
    session: ISessionService<OidcClientSession>,
    authorizeParams: FcaAuthorizeParamsInterface,
  ) => Promise<void>;
}

export interface FcaAuthorizeParamsInterface
  extends CoreAuthorizeParamsInterface {
  // login_hint is an oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  login_hint: string;
}
