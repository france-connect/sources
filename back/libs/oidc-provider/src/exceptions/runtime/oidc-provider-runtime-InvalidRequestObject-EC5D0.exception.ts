/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequestObject_EC5D0_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'EC5D0';
  static ERROR_CLASS = 'InvalidRequestObject';
  static ERROR_DETAIL = 'could not decrypt request object, err.message';
  static DOCUMENTATION = 'could not decrypt request object, err.message';
  static ERROR_SOURCE = 'actions/authorization/process_request_object.js:71';
  static UI = 'OidcProvider.exceptions.InvalidRequestObject.EC5D0';
}
