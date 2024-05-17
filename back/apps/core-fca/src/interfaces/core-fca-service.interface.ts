/* istanbul ignore file */

// Declarative file
import { Response } from 'express';

import { CoreServiceInterface } from '@fc/core';

import { CoreFcaAuthorizationParametersInterface } from './core-fca-authorization-parameters.interface';

export interface CoreFcaServiceInterface extends CoreServiceInterface {
  redirectToIdp: (
    res: Response,
    email: string,
    authorizeParams: CoreFcaAuthorizationParametersInterface,
  ) => Promise<void>;
}
