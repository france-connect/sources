export interface IOidcClaims {
  id_token?: Record<string, { essential: true } | Record<string, object>>;
  userinfo?: Record<string, { essential: true } | Record<string, object>>;
}
