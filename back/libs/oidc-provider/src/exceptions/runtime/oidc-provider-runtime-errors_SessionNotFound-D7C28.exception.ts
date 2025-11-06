/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_errors_SessionNotFound_D7C28_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'D7C28';
  static ERROR_CLASS = 'errors_SessionNotFound';
  static ERROR_DETAIL = 'authorization session and cookie identifier mismatch';
  static DOCUMENTATION = 'authorization session and cookie identifier mismatch';
  static ERROR_SOURCE = 'actions/authorization/resume.js:29';
  static UI = 'OidcProvider.exceptions.errors_SessionNotFound.D7C28';
}
