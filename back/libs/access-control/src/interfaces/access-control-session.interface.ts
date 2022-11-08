/* istanbul ignore file */

// Declarative code
import { IPermission } from './permission.interface';

export interface AccessControlSession {
  permissions: IPermission[];
}
