import axios, { AxiosError } from 'axios';

import { UserInterface } from '../interfaces';
import { UserInfosException } from './user-infos.exception';

export class UserInfosService {
  static async fetchData(endpoint: string, callback: (result: Partial<UserInterface>) => unknown) {
    callback({ ready: false });
    try {
      const { data } = await axios.get(endpoint);
      const isConnected = !!(
        data.userinfos &&
        data.userinfos.family_name &&
        data.userinfos.given_name
      );
      const userinfos = (isConnected && data.userinfos) || undefined;
      callback({ connected: isConnected, ready: true, userinfos });
    } catch (error) {
      const { response } = error as AxiosError;
      const isUnauthorized = response?.status === 401;
      if (isUnauthorized) {
        callback({ connected: false, ready: true });
      } else {
        // @TODO remplacer par une api plus consistante
        throw new UserInfosException();
      }
    }
  }
}
