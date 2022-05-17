import { IClaims } from '../../interfaces';

export const claims: IClaims = {
  openid: 'openid',
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
  address: 'address',
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  phone_number: 'phone_number',
  email: 'email',
};
