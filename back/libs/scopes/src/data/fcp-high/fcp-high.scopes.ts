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
  openid: [claims.sub],
  gender: [claims.gender],
  birthdate: [claims.birthdate],
  birthcountry: [claims.birthcountry],
  birthplace: [claims.birthplace],
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  given_name: [claims.given_name],
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  family_name: [claims.family_name],
  email: [claims.email],
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  preferred_username: [claims.preferred_username],
  address: [claims.address],
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  rnipp_identite_pivot: [
    claims.gender,
    claims.rnipp_gender,
    claims.family_name,
    claims.rnipp_family_name,
    claims.given_name,
    claims.rnipp_given_name,
    claims.rnipp_given_name_array,
    claims.birthdate,
    claims.rnipp_birthdate,
    claims.birthplace,
    claims.rnipp_birthplace,
    claims.birthcountry,
    claims.rnipp_birthcountry,
  ],
  // oidc fashioned name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  rnipp_gender: [claims.gender, claims.rnipp_gender],
  // oidc fashioned name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  rnipp_family_name: [claims.family_name, claims.rnipp_family_name],
  // oidc fashioned name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  rnipp_given_name: [
    claims.given_name,
    claims.rnipp_given_name,
    claims.rnipp_given_name_array,
  ],
  // oidc fashioned name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  rnipp_birthdate: [claims.birthdate, claims.rnipp_birthdate],
  // oidc fashioned name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  rnipp_birthplace: [claims.birthplace, claims.rnipp_birthplace],
  // oidc fashioned name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  rnipp_birthcountry: [claims.birthcountry, claims.rnipp_birthcountry],
  // oidc fashioned name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  rnipp_profile: [
    claims.given_name,
    claims.rnipp_given_name,
    claims.rnipp_given_name_array,
    claims.family_name,
    claims.rnipp_family_name,
    claims.birthdate,
    claims.rnipp_birthdate,
    claims.gender,
    claims.rnipp_gender,
    claims.preferred_username,
  ],
  // oidc fashioned name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  rnipp_birth: [
    claims.birthplace,
    claims.rnipp_birthplace,
    claims.birthcountry,
    claims.rnipp_birthcountry,
  ],
  amr: [claims.amr],
};
