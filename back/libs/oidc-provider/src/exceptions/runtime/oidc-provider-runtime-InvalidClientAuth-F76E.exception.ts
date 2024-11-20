/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientAuth_F76E_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'F76E';
  static ERROR_CLASS = 'InvalidClientAuth';
  static ERROR_DETAIL =
    'sub (JWT subject) must be provided in the client_assertion JWT';
  static DOCUMENTATION =
    'sub (JWT subject) must be provided in the client_assertion JWT';
  static ERROR_SOURCE = 'shared/token_auth.js:118';
  static UI = 'OidcProvider.exceptions.InvalidClientAuth.F76E';
}
