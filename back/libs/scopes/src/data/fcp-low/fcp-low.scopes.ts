import { ScopesInterface } from '../../interfaces';
import { claims } from './fcp-low.claims';

export const scopes: ScopesInterface = {
  profile: [
    claims.given_name,
    claims.given_name_array,
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
    claims.given_name_array,
    claims.family_name,
    claims.birthdate,
    claims.gender,
    claims.birthplace,
    claims.birthcountry,
  ],
  openid: [claims.sub],
  gender: [claims.gender],
  birthdate: [claims.birthdate],
  birthcountry: [claims.birthcountry],
  birthplace: [claims.birthplace],
  given_name: [claims.given_name, claims.given_name_array],
  family_name: [claims.family_name],
  email: [claims.email],
  preferred_username: [claims.preferred_username],
  address: [claims.address],
  idp_birthdate: [claims.idp_birthdate],
  amr: [claims.amr],
  idp_id: [claims.idp_id],
};
