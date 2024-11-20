/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequestObject_6308_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '6308';
  static ERROR_CLASS = 'InvalidRequestObject';
  static ERROR_DETAIL = 'Request Object must not be unsigned for this client';
  static DOCUMENTATION = 'Request Object must not be unsigned for this client';
  static ERROR_SOURCE = 'actions/authorization/process_request_object.js:242';
  static UI = 'OidcProvider.exceptions.InvalidRequestObject.6308';
}
