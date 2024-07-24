/* istanbul ignore file */

// Declarative code
import { AuthorizationParameters } from '@fc/oidc-client';

export interface CoreFcaAuthorizationParametersInterface
  extends AuthorizationParameters {
  sp_id: string;
  login_hint: string;
}
