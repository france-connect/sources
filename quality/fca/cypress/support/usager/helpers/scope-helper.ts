import { ScopeContext } from '../../common/types';

const aliasScopesClaims = {
  chorusdt: ['chorusdt:matricule', 'chorusdt:societe'],
  openid: ['sub'],
  phone: ['phone_number'],
};

/**
 * Get the claims matching the scopes
 * @param scopeContext scope context requested by the service provider
 * @returns an array with corresponding claims
 */
export const getClaims = (scopeContext: ScopeContext): string[] => {
  const { scopes } = scopeContext;
  const claims = scopes
    .map((scope: string): string =>
      aliasScopesClaims[scope] ? aliasScopesClaims[scope] : scope,
    )
    .flat();
  return [...new Set(claims)];
};
