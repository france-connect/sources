/* istanbul ignore file */

import { ClaimsParameter } from 'oidc-provider';

// Declarative file
export interface AccessToken {
  jti: string;
  claims?: ClaimsParameter;
  iat?: number;
  exp?: number;
  clientId?: string;
  scope?: string;
}
