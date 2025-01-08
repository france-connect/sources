import type { ServiceInterface } from './service.interface';

export interface UserPreferencesDataInterface {
  idpList: ServiceInterface[] | undefined;
  allowFutureIdp: boolean;
}
