/* istanbul ignore file */

// Declarative code
/**
 * @see https://openid.net/specs/openid-connect-core-1_0.html#rfc.section.5.1
 */
export interface IPivotIdentity {
  sub?: string;
  given_name: string;
  family_name: string;
  birthdate: string;
  gender: string;
  birthplace: string;
  birthcountry: string;
  preferred_username?: string;
  email?: string;
}
