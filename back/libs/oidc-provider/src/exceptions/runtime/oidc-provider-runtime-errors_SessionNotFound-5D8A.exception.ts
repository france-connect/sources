/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_errors_SessionNotFound_5D8A_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '5D8A';
  static ERROR_CLASS = 'errors_SessionNotFound';
  static ERROR_DETAIL = 'authorization request has expired';
  static DOCUMENTATION = 'authorization request has expired';
  static ERROR_SOURCE = 'actions/authorization/resume.js:21';
  static UI = 'OidcProvider.exceptions.errors_SessionNotFound.5D8A';
}
