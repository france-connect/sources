/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequestObject_A38D_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'A38D';
  static ERROR_CLASS = 'InvalidRequestObject';
  static ERROR_DETAIL =
    'request client_id must equal the one in request parameters';
  static DOCUMENTATION =
    'request client_id must equal the one in request parameters';
  static ERROR_SOURCE = 'actions/authorization/process_request_object.js:140';
  static UI = 'OidcProvider.exceptions.InvalidRequestObject.A38D';
}
