/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_errors_SessionNotFound_2BB27_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '2BB27';
  static ERROR_CLASS = 'errors_SessionNotFound';
  static ERROR_DETAIL =
    'interaction session and authentication session mismatch';
  static DOCUMENTATION =
    'interaction session and authentication session mismatch';
  static ERROR_SOURCE = 'actions/authorization/resume.js:42';
  static UI = 'OidcProvider.exceptions.errors_SessionNotFound.2BB27';
}
