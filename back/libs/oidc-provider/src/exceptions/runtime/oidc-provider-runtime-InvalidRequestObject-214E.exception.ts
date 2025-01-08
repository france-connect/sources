/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequestObject_214E_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '214E';
  static ERROR_CLASS = 'InvalidRequestObject';
  static ERROR_DETAIL = 'Cross-JWT Confusion Request Object';
  static DOCUMENTATION = 'Cross-JWT Confusion Request Object';
  static ERROR_SOURCE = 'actions/authorization/process_request_object.js:206';
  static UI = 'OidcProvider.exceptions.InvalidRequestObject.214E';
}
