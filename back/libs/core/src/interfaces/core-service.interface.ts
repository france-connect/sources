import { Response } from 'express';

import { AuthorizationParameters } from '@fc/oidc-client';

export interface CoreServiceInterface {
  redirectToIdp: (
    res: Response,
    idpId: string,
    authorizeParams: AuthorizationParameters,
  ) => Promise<void>;
}

export interface CoreAuthorizationServiceInterface {
  getAuthorizeUrl(
    idpId: string,
    parameters: AuthorizationParameters,
  ): Promise<string>;
}
