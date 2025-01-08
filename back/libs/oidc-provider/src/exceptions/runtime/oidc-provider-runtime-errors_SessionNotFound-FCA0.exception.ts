/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_errors_SessionNotFound_FCA0_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'FCA0';
  static ERROR_CLASS = 'errors_SessionNotFound';
  static ERROR_DETAIL = 'authorization session and cookie identifier mismatch';
  static DOCUMENTATION = 'authorization session and cookie identifier mismatch';
  static ERROR_SOURCE = 'actions/authorization/resume.js:33';
  static UI = 'OidcProvider.exceptions.errors_SessionNotFound.FCA0';
}
