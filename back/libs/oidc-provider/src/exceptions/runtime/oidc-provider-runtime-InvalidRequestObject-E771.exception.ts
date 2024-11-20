/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequestObject_E771_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'E771';
  static ERROR_CLASS = 'InvalidRequestObject';
  static ERROR_DETAIL = 'unsupported signed request alg';
  static DOCUMENTATION = 'unsupported signed request alg';
  static ERROR_SOURCE = 'actions/authorization/process_request_object.js:154';
  static UI = 'OidcProvider.exceptions.InvalidRequestObject.E771';
}
