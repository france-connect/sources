/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequestObject_E27A_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'E27A';
  static ERROR_CLASS = 'InvalidRequestObject';
  static ERROR_DETAIL =
    'Request Object must not contain request or request_uri properties';
  static DOCUMENTATION =
    'Request Object must not contain request or request_uri properties';
  static ERROR_SOURCE = 'actions/authorization/process_request_object.js:124';
  static UI = 'OidcProvider.exceptions.InvalidRequestObject.E27A';
}
