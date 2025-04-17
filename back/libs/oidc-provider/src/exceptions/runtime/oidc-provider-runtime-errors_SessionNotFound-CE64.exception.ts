/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_errors_SessionNotFound_CE64_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'CE64';
  static ERROR_CLASS = 'errors_SessionNotFound';
  static ERROR_DETAIL =
    'interaction session and authentication session mismatch';
  static DOCUMENTATION =
    'interaction session and authentication session mismatch';
  static ERROR_SOURCE = 'actions/authorization/resume.js:44';
  static UI = 'OidcProvider.exceptions.errors_SessionNotFound.CE64';
}
