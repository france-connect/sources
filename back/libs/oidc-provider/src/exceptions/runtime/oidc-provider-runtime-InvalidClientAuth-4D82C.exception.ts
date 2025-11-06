/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientAuth_4D82C_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '4D82C';
  static ERROR_CLASS = 'InvalidClientAuth';
  static ERROR_DETAIL =
    'the provided authentication mechanism does not match the registered client authentication method';
  static DOCUMENTATION =
    'the provided authentication mechanism does not match the registered client authentication method';
  static ERROR_SOURCE = 'shared/client_auth.js:174';
  static UI = 'OidcProvider.exceptions.InvalidClientAuth.4D82C';
}
