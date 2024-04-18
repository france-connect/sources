import { ClaimsInterface, ScopesInterface } from '../interfaces';

export function oneToOneScopeFromClaims(
  claims: ClaimsInterface,
): ScopesInterface {
  const entries = Object.values(claims).map((claim) => [claim, [claim]]);

  const scopes = Object.fromEntries(entries);

  return scopes;
}
