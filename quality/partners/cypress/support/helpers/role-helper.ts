import { Role } from '../types';

export const getRoles = (
  roles: Role[],
  condition: (Role) => boolean,
): Role[] => {
  return roles.filter(condition);
};

export const getRolesByUserId = (roles: Role[], userId: string): Role[] => {
  const condition = (role: Role) => role.userId === userId;
  return getRoles(roles, condition);
};

export const getRolesByUserIdAndEntity = (
  roles: Role[],
  userId: string,
  entity: string,
): Role[] => {
  const condition = (role: Role) =>
    role.userId === userId && role.entity === entity;
  return getRoles(roles, condition);
};
