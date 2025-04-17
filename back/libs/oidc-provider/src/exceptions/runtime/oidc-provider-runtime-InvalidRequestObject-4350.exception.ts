/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequestObject_4350_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '4350';
  static ERROR_CLASS = 'InvalidRequestObject';
  static ERROR_DETAIL =
    "request client_id must equal the authenticated client's client_id";
  static DOCUMENTATION =
    "request client_id must equal the authenticated client's client_id";
  static ERROR_SOURCE = 'actions/authorization/process_request_object.js:136';
  static UI = 'OidcProvider.exceptions.InvalidRequestObject.4350';
}
