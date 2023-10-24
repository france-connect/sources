/* istanbul ignore file */

// Declarative code

export interface OidcAddress {
  country: string;
  // oidc claim
  // eslint-disable-next-line @typescript-eslint/naming-convention
  postal_code: string;
  locality: string;
  // oidc claim
  // eslint-disable-next-line @typescript-eslint/naming-convention
  street_address: string;
  formatted: string;
}

export interface OidcClaims {
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
  address: OidcAddress;
  [key: string]: unknown;
}
