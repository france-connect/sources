/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_errors_AccessDenied_3FE5_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '3FE5';
  static ERROR_CLASS = 'errors_AccessDenied';
  static ERROR_DETAIL =
    'undefined, authorization request resolved without requesting interactions but no scope was granted';
  static DOCUMENTATION =
    'undefined, authorization request resolved without requesting interactions but no scope was granted';
  static ERROR_SOURCE = 'actions/authorization/interactions.js:68';
  static UI = 'OidcProvider.exceptions.errors_AccessDenied.3FE5';
}
