/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequestObject_A686C_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'A686C';
  static ERROR_CLASS = 'InvalidRequestObject';
  static ERROR_DETAIL =
    'request client_id must equal the one in request parameters';
  static DOCUMENTATION =
    'request client_id must equal the one in request parameters';
  static ERROR_SOURCE = 'actions/authorization/process_request_object.js:130';
  static UI = 'OidcProvider.exceptions.InvalidRequestObject.A686C';
}
