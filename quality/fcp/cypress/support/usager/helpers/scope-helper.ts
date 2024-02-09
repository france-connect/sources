import { ScopeContext, UserClaims } from '../../common/types';

/*
Alias definition:
- profile : Regroupe les scopes given_name, family_name, birthdate et gender. Si disponible, renvoie aussi preferred_username
- birth : Regroupe les scopes birthplace et birthcountry. Permet de récupérer la ville et le département de naissance de la personne.
- identite_pivot : Regroupe les scopes profile et birth. Permet de récupérer l'identité pivot complète plus le nom d'usage si disponible.
*/
const aliasScopesClaims = {
  birth: ['birthplace', 'birthcountry'],
  identite_pivot: [
    'birthcountry',
    'birthdate',
    'birthplace',
    'family_name',
    'gender',
    'given_name',
  ],
  openid: ['sub'],
  profile: [
    'birthdate',
    'family_name',
    'gender',
    'given_name',
    'preferred_username',
  ],
};

const rnippClaims = {
  rnipp_birthcountry: 'birthcountry',
  rnipp_birthdate: 'birthdate',
  rnipp_birthplace: 'birthplace',
  rnipp_family_name: 'family_name',
  rnipp_gender: 'gender',
  rnipp_given_name: 'given_name',
  rnipp_given_name_array: 'given_name_array',
};

const idpClaims = {
  idp_birthdate: 'birthdate',
};

/* eslint-disable @typescript-eslint/naming-convention */
const CLAIM_LABELS = {
  address: 'Adresse postale',
  birthcountry: 'Pays de naissance',
  birthdate: 'Date de naissance',
  birthplace: 'Lieu de naissance',
  connexion_tracks: 'Historique de connexions',
  email: 'Adresse email',
  family_name: 'Nom de naissance',
  gender: 'Sexe',
  given_name: 'Prénom(s)',
  given_name_array: 'Prénom(s)',
  idp_birthdate: 'Date de naissance',
  preferred_username: 'Nom d’usage',
};

const DEFAULT_SCOPE_TYPE = 'tous les scopes';
const DEFAULT_SCOPE_IDP_TYPE = 'tous les scopes sans alias';

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
 * Get the default scope context for the tests
 * @param {ScopeContext[]} scopes array of all the scope contexts from the fixtures
 * @returns the default scope context
 */
export const getDefaultScope = (scopes: ScopeContext[]): ScopeContext => {
  return getScopeByType(scopes, DEFAULT_SCOPE_TYPE);
};

/**
 * Get the default scope context use for the Identity Provider
 * @param {ScopeContext[]} scopes array of all the scope contexts from the fixtures
 * @returns the default scope context
 */
export const getDefaultIdpScope = (scopes: ScopeContext[]): ScopeContext => {
  return getScopeByType(scopes, DEFAULT_SCOPE_IDP_TYPE);
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

export const getRnippClaims = (
  userClaims: UserClaims,
  prefix = 'rnipp_',
): UserClaims => {
  const userRnippClaims = {};
  Object.entries(rnippClaims).forEach(([rnippClaimName, claimName]) => {
    // Use the "rnipp_" claim if present otherwise use the default user claim
    userRnippClaims[`${prefix}${claimName}`] =
      rnippClaimName in userClaims
        ? userClaims[rnippClaimName]
        : userClaims[claimName];
  });
  return userRnippClaims;
};

export const getIdpClaims = (userClaims: UserClaims): UserClaims => {
  const userIdpClaims = {};
  Object.entries(idpClaims).forEach(([idpClaimName, claimName]) => {
    // Use the "idp_" claim if present otherwise use the default user claim
    userIdpClaims[idpClaimName] =
      idpClaimName in userClaims
        ? userClaims[idpClaimName]
        : userClaims[claimName];
  });
  return userIdpClaims;
};

export const getClaimsWithoutRnippPrefix = (
  scopeContext: ScopeContext,
): Set<string> => {
  const expectedClaimsSet = new Set<string>();
  const expectedClaims = getClaims(scopeContext).filter(
    (claimName) => claimName !== 'sub',
  );
  expectedClaims
    .map((claimName) => claimName.replace('rnipp_', ''))
    .map((claim) => CLAIM_LABELS[claim])
    .forEach((claimLabel) => expectedClaimsSet.add(claimLabel));

  return expectedClaimsSet;
};
