/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_errors_SessionNotFound_D5AB7_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'D5AB7';
  static ERROR_CLASS = 'errors_SessionNotFound';
  static ERROR_DETAIL = 'authorization request has expired';
  static DOCUMENTATION = 'authorization request has expired';
  static ERROR_SOURCE = 'actions/authorization/resume.js:19';
  static UI = 'OidcProvider.exceptions.errors_SessionNotFound.D5AB7';
}
