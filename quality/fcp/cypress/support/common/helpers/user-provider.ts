import { UserData } from '../types';
import { User } from './user';

const DEFAULT_USER_CRITERIA = 'par défaut';

export const getUserByCriteria = (
  users: UserData[],
  criteria: string[],
): User => {
  const user: User = User.extractUserFromDataByCriteria(users, criteria);
  expect(user, `No user matches the criteria ${JSON.stringify(criteria)}`).to
    .exist;
  cy.wrap(user).as('user');
  return user;
};

export const getEnabledUserByIdpId = (
  users: UserData[],
  idpId: string,
): User => {
  const user: User = User.extractEnabledUserFromDataByIdpId(users, idpId);
  expect(
    user,
    `No active user has credentials for the identity provider '${idpId}'`,
  ).to.exist;
  cy.wrap(user).as('user');
  return user;
};

export const getDefaultUser = (users: UserData[]): User =>
  getUserByCriteria(users, [DEFAULT_USER_CRITERIA]);
