/* istanbul ignore file */

// Declarative code

export interface OidcAddress {
  country: string;
  postal_code: string;
  locality: string;
  street_address: string;
  formatted: string;
}

export interface OidcClaims {
  sub: string;
  given_name: string;
  family_name: string;
  birthdate: string;
  gender: string;
  birthplace: string;
  birthcountry: string;
  preferred_username?: string;
  email: string;
  address: OidcAddress;
  [key: string]: unknown;
}
