/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_errors_AccessDenied_666C_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '666C';
  static ERROR_CLASS = 'errors_AccessDenied';
  static ERROR_DETAIL =
    'undefined, authorization request resolved without requesting interactions but no scope was granted';
  static DOCUMENTATION =
    'undefined, authorization request resolved without requesting interactions but no scope was granted';
  static ERROR_SOURCE = 'actions/authorization/interactions.js:71';
  static UI = 'OidcProvider.exceptions.errors_AccessDenied.666C';
}
