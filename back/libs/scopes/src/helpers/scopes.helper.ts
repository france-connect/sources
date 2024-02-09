import { IClaims, IScopes } from '../interfaces';

export function oneToOneScopeFromClaims(claims: IClaims): IScopes {
  const entries = Object.values(claims).map((claim) => [claim, [claim]]);

  const scopes = Object.fromEntries(entries);

  return scopes;
}
