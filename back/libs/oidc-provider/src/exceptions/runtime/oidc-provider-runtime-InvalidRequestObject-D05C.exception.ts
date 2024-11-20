/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequestObject_D05C_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'D05C';
  static ERROR_CLASS = 'InvalidRequestObject';
  static ERROR_DETAIL = 'could not parse Request Object, err.message';
  static DOCUMENTATION = 'could not parse Request Object, err.message';
  static ERROR_SOURCE = 'actions/authorization/process_request_object.js:86';
  static UI = 'OidcProvider.exceptions.InvalidRequestObject.D05C';
}
