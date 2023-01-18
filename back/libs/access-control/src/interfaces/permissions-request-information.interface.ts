/* istanbul ignore file */

// Declarative code
import { Request } from 'express';

import { IPermission } from './permission.interface';

export interface PermissionsRequestInformations extends RequestInformations {
  userPermissions: IPermission[];
}

export interface RequestInformations {
  body: Request['body'];
  params: Request['params'];
  query: Request['query'];
}
