/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequestObject_D5B5_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'D5B5';
  static ERROR_CLASS = 'InvalidRequestObject';
  static ERROR_DETAIL =
    'request response_type must equal the one in request parameters';
  static DOCUMENTATION =
    'request response_type must equal the one in request parameters';
  static ERROR_SOURCE = 'actions/authorization/process_request_object.js:123';
  static UI = 'OidcProvider.exceptions.InvalidRequestObject.D5B5';
}
