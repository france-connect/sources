/* istanbul ignore file */

// Declarative file
import { Response } from 'express';

import { CoreServiceInterface } from '@fc/core';

import { CoreFcpAuthorizationParametersInterface } from './core-fcp-authorization-parameters.interface';

export interface CoreFcpServiceInterface extends CoreServiceInterface {
  redirectToIdp: (
    res: Response,
    idpId: string,
    authorizeParams: CoreFcpAuthorizationParametersInterface,
  ) => Promise<void>;
}
