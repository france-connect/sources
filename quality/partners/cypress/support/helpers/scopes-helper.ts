const IDENTITY_SCOPES = [
  'openid',
  'given_name',
  'family_name',
  'birthdate',
  'gender',
  'birthplace',
  'birthcountry',
  'preferred_username',
  'email',
  'profile',
  'birth',
  'identite_pivot',
];

export const getAllIdentityScopes = (): string[] => {
  return IDENTITY_SCOPES;
};

export const getMissingIdentityScopes = (scopes: string[]): string[] => {
  const requested = new Set(scopes);
  return IDENTITY_SCOPES.filter((scope) => !requested.has(scope));
};
