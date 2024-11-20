/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_errors_SessionNotFound_FD78_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'FD78';
  static ERROR_CLASS = 'errors_SessionNotFound';
  static ERROR_DETAIL = 'authorization request has expired';
  static DOCUMENTATION = 'authorization request has expired';
  static ERROR_SOURCE = 'actions/authorization/resume.js:23';
  static UI = 'OidcProvider.exceptions.errors_SessionNotFound.FD78';
}
