/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequestObject_9EB6_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '9EB6';
  static ERROR_CLASS = 'InvalidRequestObject';
  static ERROR_DETAIL = 'could not decrypt request object, err.message';
  static DOCUMENTATION = 'could not decrypt request object, err.message';
  static ERROR_SOURCE = 'actions/authorization/process_request_object.js:72';
  static UI = 'OidcProvider.exceptions.InvalidRequestObject.9EB6';
}
