/* istanbul ignore file */

// Declarative file
export interface DpJwtPayloadInterface {
  // oidc naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  token_introspection: {
    active: boolean;
    aud?: string;
    sub?: string;
    iat?: number;
    exp?: number;
    jti?: string;
    acr?: string;
    scope?: string;
    [propName: string]: unknown;
  };
}
