import { plainToClass } from 'class-transformer';

import { UserClaims, UserCredentials, UserData } from '../types';

const DEFAULT_CREDENTIALS = 'default';

export class User implements UserData {
  public enabled: boolean;
  public claims: UserClaims;
  public credentials: [UserCredentials];
  public criteria: string[];

  static extractUserFromData(
    users: UserData[],
    condition: (_: UserData) => boolean,
  ): User {
    const userData: UserData = users.find(condition);
    const currentUser = plainToClass(User, userData);
    return currentUser;
  }

  static extractUserFromDataByCriteria(
    users: UserData[],
    criteria: string[],
  ): User {
    const condition = (user: UserData) =>
      criteria.every((criterion) => user.criteria.includes(criterion));
    return User.extractUserFromData(users, condition);
  }

  static extractEnabledUserFromDataByIdpId(
    users: UserData[],
    idpId: string,
  ): User {
    const condition = (user: UserData) =>
      user.enabled === true &&
      user.credentials.some(
        (credentials: UserCredentials): boolean => credentials.idpId === idpId,
      );
    return User.extractUserFromData(users, condition);
  }

  getCredentials(idpId: string, useDefault = true): UserCredentials {
    let idpCredentials = this.credentials.find(
      (credentials) => credentials.idpId === idpId,
    );
    if (!idpCredentials && useDefault) {
      idpCredentials = this.credentials.find(
        (credentials) => credentials.idpId === DEFAULT_CREDENTIALS,
      );
    }
    return idpCredentials;
  }

  get fullName(): string {
    const { claims = {} } = this;
    const { family_name, given_name, preferred_username } = claims;

    const lastName = preferred_username || family_name;
    return [given_name, lastName].join(' ').trim();
  }
}
