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
  address: OidcAddress;
  [key: string]: unknown;
}
