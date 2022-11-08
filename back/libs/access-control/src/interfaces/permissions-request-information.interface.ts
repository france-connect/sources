/* istanbul ignore file */

// Declarative code
import { Request } from 'express';

import { IPermission } from './permission.interface';

export interface PermissionsRequestInformations {
  body: Request['body'];
  params: Request['params'];
  query: Request['query'];
  userPermissions: IPermission[];
}
