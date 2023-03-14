import { ScopeContext } from '../../common/types';

const aliasScopesClaims = {
  chorusdt: ['chorusdt:matricule', 'chorusdt:societe'],
  openid: ['sub'],
  phone: ['phone_number'],
};

const DEFAULT_SCOPE_TYPE = 'tous les scopes';

/**
 * Get the scope context matching the type
 * @param {ScopeContext[]} scopes array of all the scope contexts from the fixtures
 * @param {string} type type of scope context
 * @returns a scope context with a type and array of scopes
 */
export const getScopeByType = (
  scopes: ScopeContext[],
  type: string,
): ScopeContext => {
  const scopeContext: ScopeContext = scopes.find(
    (scope) => scope.type === type,
  );
  expect(scopeContext, `No scope matches the type '${type}'`).to.exist;
  return scopeContext;
};

/**
 * Get the default scope context
 * @param {ScopeContext[]} scopes array of all the scope contexts from the fixtures
 * @returns the default scope context
 */
export const getDefaultScope = (scopes: ScopeContext[]): ScopeContext => {
  return getScopeByType(scopes, DEFAULT_SCOPE_TYPE);
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
