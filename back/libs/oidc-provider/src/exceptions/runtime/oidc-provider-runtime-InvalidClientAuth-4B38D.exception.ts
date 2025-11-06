/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientAuth_4B38D_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '4B38D';
  static ERROR_CLASS = 'InvalidClientAuth';
  static ERROR_DETAIL =
    'sub (JWT subject) must be provided in the client_assertion JWT';
  static DOCUMENTATION =
    'sub (JWT subject) must be provided in the client_assertion JWT';
  static ERROR_SOURCE = 'shared/client_auth.js:124';
  static UI = 'OidcProvider.exceptions.InvalidClientAuth.4B38D';
}
