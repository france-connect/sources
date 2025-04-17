/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequestObject_D2D7_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'D2D7';
  static ERROR_CLASS = 'InvalidRequestObject';
  static ERROR_DETAIL = 'Request Object claims are invalid, err.message';
  static DOCUMENTATION = 'Request Object claims are invalid, err.message';
  static ERROR_SOURCE = 'actions/authorization/process_request_object.js:163';
  static UI = 'OidcProvider.exceptions.InvalidRequestObject.D2D7';
}
