/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_errors_SessionNotFound_5C52_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '5C52';
  static ERROR_CLASS = 'errors_SessionNotFound';
  static ERROR_DETAIL = 'authorization session and cookie identifier mismatch';
  static DOCUMENTATION = 'authorization session and cookie identifier mismatch';
  static ERROR_SOURCE = 'actions/authorization/resume.js:31';
  static UI = 'OidcProvider.exceptions.errors_SessionNotFound.5C52';
}
