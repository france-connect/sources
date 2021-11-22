/**
 * @see https://openid.net/specs/openid-connect-core-1_0.html#rfc.section.5.1
 */
export interface UserinfosInterface {
  sub: string;
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  given_name: string;
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  family_name: string;
  birthdate: string;
  gender: string;
  birthplace: string;
  birthcountry: string;
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  preferred_username?: string;
  email: string;
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  phone_number?: string;
}
