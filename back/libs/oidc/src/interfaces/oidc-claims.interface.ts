/* istanbul ignore file */

// Declarative code
export interface IOidcClaims {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  id_token?: Record<string, { essential: true } | Record<string, object>>;
  userinfo?: Record<string, { essential: true } | Record<string, object>>;
}
