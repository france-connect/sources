/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequestObject_320A_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '320A';
  static ERROR_CLASS = 'InvalidRequestObject';
  static ERROR_DETAIL =
    'Request Object must not contain request or request_uri properties';
  static DOCUMENTATION =
    'Request Object must not contain request or request_uri properties';
  static ERROR_SOURCE = 'actions/authorization/process_request_object.js:115';
  static UI = 'OidcProvider.exceptions.InvalidRequestObject.320A';
}
