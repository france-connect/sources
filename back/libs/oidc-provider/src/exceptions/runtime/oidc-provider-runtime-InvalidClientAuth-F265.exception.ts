/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientAuth_F265_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'F265';
  static ERROR_CLASS = 'InvalidClientAuth';
  static ERROR_DETAIL =
    'the registered client ${endpoint}_endpoint_auth_method does not match the provided auth mechanism';
  static DOCUMENTATION =
    'the registered client ${endpoint}_endpoint_auth_method does not match the provided auth mechanism';
  static ERROR_SOURCE = 'shared/token_auth.js:168';
  static UI = 'OidcProvider.exceptions.InvalidClientAuth.F265';
}
