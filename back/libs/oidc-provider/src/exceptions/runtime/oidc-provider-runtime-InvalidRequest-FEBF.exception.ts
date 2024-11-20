/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_FEBF_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'FEBF';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'xsrf token invalid';
  static DOCUMENTATION = 'xsrf token invalid';
  static ERROR_SOURCE = 'actions/code_verification.js:59';
  static UI = 'OidcProvider.exceptions.InvalidRequest.FEBF';
}
