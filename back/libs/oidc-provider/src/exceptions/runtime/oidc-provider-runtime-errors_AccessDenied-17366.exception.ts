/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_errors_AccessDenied_17366_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '17366';
  static ERROR_CLASS = 'errors_AccessDenied';
  static ERROR_DETAIL =
    'undefined, authorization request resolved without requesting interactions but no account id was resolved';
  static DOCUMENTATION =
    'undefined, authorization request resolved without requesting interactions but no account id was resolved';
  static ERROR_SOURCE = 'actions/authorization/interactions.js:52';
  static UI = 'OidcProvider.exceptions.errors_AccessDenied.17366';
}
