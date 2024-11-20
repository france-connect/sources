/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequestObject_F9B5_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'F9B5';
  static ERROR_CLASS = 'InvalidRequestObject';
  static ERROR_DETAIL = 'Request Object is missing the nbf claim';
  static DOCUMENTATION = 'Request Object is missing the nbf claim';
  static ERROR_SOURCE = 'actions/authorization/process_request_object.js:179';
  static UI = 'OidcProvider.exceptions.InvalidRequestObject.F9B5';
}
