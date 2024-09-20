import type { UserInfosInterface } from '../../interfaces';

export class ConnectValidator {
  static validate(data: UserInfosInterface) {
    const result = !!data.firstname && !!data.lastname;
    return result;
  }
}
