/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequestObject_7ACFA_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '7ACFA';
  static ERROR_CLASS = 'InvalidRequestObject';
  static ERROR_DETAIL =
    'request response_type must equal the one in request parameters';
  static DOCUMENTATION =
    'request response_type must equal the one in request parameters';
  static ERROR_SOURCE = 'actions/authorization/process_request_object.js:122';
  static UI = 'OidcProvider.exceptions.InvalidRequestObject.7ACFA';
}
