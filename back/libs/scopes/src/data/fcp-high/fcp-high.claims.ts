import { IClaims } from '../../interfaces';

export const claims: IClaims = {
  sub: 'sub',
  gender: 'gender',
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  given_name: 'given_name',
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  family_name: 'family_name',
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  preferred_username: 'preferred_username',
  birthdate: 'birthdate',
  birthplace: 'birthplace',
  birthcountry: 'birthcountry',

  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  rnipp_gender: 'rnipp_gender',
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  rnipp_given_name: 'rnipp_given_name',
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  rnipp_given_name_array: 'rnipp_given_name_array',
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  rnipp_family_name: 'rnipp_family_name',
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  rnipp_birthdate: 'rnipp_birthdate',
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  rnipp_birthplace: 'rnipp_birthplace',
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  rnipp_birthcountry: 'rnipp_birthcountry',

  address: 'address',
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  phone_number: 'phone_number',
  email: 'email',
};
