import type { UserInfosInterface } from './user-infos.interface';

export interface UserInfosValidatorInterface {
  validate: (userInfos: UserInfosInterface) => boolean;
}
