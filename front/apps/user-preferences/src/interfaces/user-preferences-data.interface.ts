/* istanbul ignore file */

// declarative file
import type { Service } from './service.interface';

export interface UserPreferencesData {
  idpList: Service[] | undefined;
  allowFutureIdp: boolean;
}
