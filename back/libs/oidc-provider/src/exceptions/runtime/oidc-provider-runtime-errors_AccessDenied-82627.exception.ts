/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_errors_AccessDenied_82627_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '82627';
  static ERROR_CLASS = 'errors_AccessDenied';
  static ERROR_DETAIL =
    'undefined, authorization request resolved without requesting interactions but no scope was granted';
  static DOCUMENTATION =
    'undefined, authorization request resolved without requesting interactions but no scope was granted';
  static ERROR_SOURCE = 'actions/authorization/interactions.js:67';
  static UI = 'OidcProvider.exceptions.errors_AccessDenied.82627';
}
