import axios, { AxiosError } from 'axios';

import { AccountInterface } from '../interfaces';
// @TODO remplacer par une api plus consistante
// import { AccountException } from './account.exception';

export class AccountService {
  static async fetchData(
    endpoint: string,
    callback: (result: Partial<AccountInterface>) => unknown,
  ) {
    // @TODO split sucess and error process into two functions
    callback({ ready: false });
    try {
      // @NOTE !!! DO NOT USE status == 200 to check
      // if user is connected or not
      // actually backend always return 200
      const { data } = await axios.get(endpoint);
      const isConnected = !!(data && data.firstname && data.lastname);
      const userinfos = (isConnected && data) || undefined;
      callback({ connected: isConnected, ready: true, userinfos });
    } catch (error) {
      const { response } = error as AxiosError;
      const isUnauthorized = response?.status === 401;
      if (isUnauthorized) {
        callback({ connected: false, ready: true });
      } else {
        // @TODO remplacer par une api plus consistante
        // throw new AccountException();
        // Temporary log
        // eslint-disable-next-line no-console
        console.warn("Erreur lors de l'appel HTTP");
      }
    }
  }
}
