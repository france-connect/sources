import { IClaims, IGroupedClaims, IRichClaim, IScopes } from '../interfaces';

export function oneToOneScopeFromClaims(claims: IClaims): IScopes {
  const entries = Object.values(claims).map((claim) => [claim, [claim]]);

  const scopes = Object.fromEntries(entries);

  return scopes;
}

export function groupByDataProviderReducer(
  acc: IGroupedClaims,
  claim: IRichClaim,
): IGroupedClaims {
  const { key: name, label } = claim.provider;

  if (!acc[name]) {
    acc[name] = {
      label,
      claims: [],
    };
  }

  acc[name].claims.push(claim.label);

  return acc;
}

export function groupByDataProvider(claims: IRichClaim[]): IGroupedClaims {
  const grouped = claims.reduce(
    groupByDataProviderReducer,
    {} as IGroupedClaims,
  );

  return grouped;
}
