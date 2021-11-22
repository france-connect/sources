/* istanbul ignore file */

// Declarative code
export interface OidcError {
  readonly error: string;
  // oidc parameter
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly error_description: string;
}
