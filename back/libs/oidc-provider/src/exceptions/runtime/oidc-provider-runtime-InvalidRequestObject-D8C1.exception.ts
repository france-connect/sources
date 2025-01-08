/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequestObject_D8C1_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'D8C1';
  static ERROR_CLASS = 'InvalidRequestObject';
  static ERROR_DETAIL = 'Request Object exp claim too far from nbf claim';
  static DOCUMENTATION = 'Request Object exp claim too far from nbf claim';
  static ERROR_SOURCE = 'actions/authorization/process_request_object.js:183';
  static UI = 'OidcProvider.exceptions.InvalidRequestObject.D8C1';
}
