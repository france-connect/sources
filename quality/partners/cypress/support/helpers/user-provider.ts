import type { UserData } from '../types';

const DEFAULT_USER_DESCRIPTION = 'default';

export const getUserByDescription = (
  users: UserData[],
  description: string,
): UserData => {
  const user: UserData = users.find((user) =>
    user.descriptions.includes(description),
  );
  expect(user, `No users match the description '${description}'`).to.exist;
  return user;
};

export const getDefaultUser = (users: UserData[]): UserData =>
  getUserByDescription(users, DEFAULT_USER_DESCRIPTION);
