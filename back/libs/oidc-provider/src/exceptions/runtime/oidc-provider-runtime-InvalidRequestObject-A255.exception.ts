/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequestObject_A255_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'A255';
  static ERROR_CLASS = 'InvalidRequestObject';
  static ERROR_DETAIL = 'request client_id mismatch';
  static DOCUMENTATION = 'request client_id mismatch';
  static ERROR_SOURCE = 'actions/authorization/process_request_object.js:150';
  static UI = 'OidcProvider.exceptions.InvalidRequestObject.A255';
}
