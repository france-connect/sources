/* istanbul ignore file */

// Declarative file

export interface MinimalCustomIdentityInterface {
  acr: string;
  // OIDC naming convention
  // eslint-disable-next-line @typescript-eslint/naming-convention
  given_name: string;
  email: string;
}
