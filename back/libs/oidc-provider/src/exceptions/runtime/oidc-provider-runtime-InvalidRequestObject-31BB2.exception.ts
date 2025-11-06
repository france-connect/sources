/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequestObject_31BB2_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '31BB2';
  static ERROR_CLASS = 'InvalidRequestObject';
  static ERROR_DETAIL =
    "request client_id must equal the authenticated client's client_id";
  static DOCUMENTATION =
    "request client_id must equal the authenticated client's client_id";
  static ERROR_SOURCE = 'actions/authorization/process_request_object.js:135';
  static UI = 'OidcProvider.exceptions.InvalidRequestObject.31BB2';
}
