import { User } from '../types';

export const getUserByCriteria = (users: User[], criteria: string[]): User => {
  const condition = (user: User) =>
    criteria.every((criterion) => user.criteria.includes(criterion));
  const user = users.find(condition);
  expect(user, `No user matches the criteria ${JSON.stringify(criteria)}`).to
    .exist;
  return user;
};
