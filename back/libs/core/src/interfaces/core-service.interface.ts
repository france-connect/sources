/* istanbul ignore file */

// Declarative file
import { Response } from 'express';

import { OidcClientSession } from '@fc/oidc-client';
import { ISessionService } from '@fc/session';

export interface CoreServiceInterface {
  redirectToIdp: (
    res: Response,
    idpId: string,
    session: ISessionService<OidcClientSession>,
    authorizeParams: CoreAuthorizeParamsInterface,
  ) => Promise<void>;
}

export interface CoreAuthorizeParamsInterface {
  acr: string;
}
