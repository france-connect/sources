/* istanbul ignore file */

// Declarative code
import { AuthorizationParameters } from '@fc/oidc-client';

export interface CoreFcaAuthorizationParametersInterface
  extends AuthorizationParameters {
  // We want the same nomenclature as OpenId Connect
  // eslint-disable-next-line @typescript-eslint/naming-convention
  sp_id: string;
  // login_hint is an oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  login_hint: string;
}
