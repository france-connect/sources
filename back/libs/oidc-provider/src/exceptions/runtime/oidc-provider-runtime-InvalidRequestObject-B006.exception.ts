/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequestObject_B006_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'B006';
  static ERROR_CLASS = 'InvalidRequestObject';
  static ERROR_DETAIL = 'Request Object is missing the "${claim}" claim';
  static DOCUMENTATION = 'Request Object is missing the "${claim}" claim';
  static ERROR_SOURCE = 'actions/authorization/process_request_object.js:192';
  static UI = 'OidcProvider.exceptions.InvalidRequestObject.B006';
}
