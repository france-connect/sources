import { oneToOneScopeFromClaims } from '../../helpers';
import { IScopes } from '../../interfaces';
import { claims } from './fcp-high.claims';

export const scopes: IScopes = {
  profile: [
    claims.given_name,
    claims.family_name,
    claims.birthdate,
    claims.gender,
    claims.preferred_username,
  ],
  phone: [claims.phone_number],
  birth: [claims.birthplace, claims.birthcountry],
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  identite_pivot: [
    claims.given_name,
    claims.family_name,
    claims.birthdate,
    claims.gender,
    claims.birthplace,
    claims.birthcountry,
  ],
  ...oneToOneScopeFromClaims(claims),
};
