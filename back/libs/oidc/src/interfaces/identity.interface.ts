/* istanbul ignore file */

// Declarative code
/**
 * @see https://openid.net/specs/openid-connect-core-1_0.html#rfc.section.5.1
 */
export interface IOidcIdentity {
  sub: string;
  given_name: string;
  given_name_array: string[];
  family_name: string;
  birthdate: string;
  idp_birthdate: string;
  gender: string;
  birthplace: string;
  birthcountry: string;
  preferred_username?: string;
  email: string;
  rep_scope?: string;
}
