/* istanbul ignore file */

// Declarative code
/**
 * @see https://openid.net/specs/openid-connect-core-1_0.html#rfc.section.5.1
 */
export interface IOidcIdentity {
  sub: string;
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  given_name: string;
  // variable name based on given_name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  given_name_array: string[];
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  family_name: string;
  birthdate: string;
  // oidc claim
  // eslint-disable-next-line @typescript-eslint/naming-convention
  idp_birthdate: string;
  gender: string;
  birthplace: string;
  birthcountry: string;
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  preferred_username?: string;
  email: string;
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  rep_scope?: string;
}
