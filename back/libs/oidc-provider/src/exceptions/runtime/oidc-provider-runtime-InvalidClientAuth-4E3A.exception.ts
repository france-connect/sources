/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientAuth_4E3A_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '4E3A';
  static ERROR_CLASS = 'InvalidClientAuth';
  static ERROR_DETAIL =
    'the provided authentication mechanism does not match the registered client authentication method';
  static DOCUMENTATION =
    'the provided authentication mechanism does not match the registered client authentication method';
  static ERROR_SOURCE = 'shared/token_auth.js:177';
  static UI = 'OidcProvider.exceptions.InvalidClientAuth.4E3A';
}
