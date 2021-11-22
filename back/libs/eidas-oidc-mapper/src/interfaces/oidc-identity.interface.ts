/* istanbul ignore file */

// Declarative code
import { OidcClaims } from '../enums';

export interface IOidcIdentity {
  readonly [OidcClaims.SUB]: string;
  readonly [OidcClaims.GENDER]?: string;
  readonly [OidcClaims.GIVEN_NAME]?: string;
  readonly [OidcClaims.FAMILY_NAME]?: string;
  readonly [OidcClaims.PREFERRED_USERNAME]?: string;
  readonly [OidcClaims.BIRTHDATE]?: string;
  readonly [OidcClaims.BIRTHPLACE]?: string;
  readonly [OidcClaims.BIRTHCOUNTRY]?: string;
}
