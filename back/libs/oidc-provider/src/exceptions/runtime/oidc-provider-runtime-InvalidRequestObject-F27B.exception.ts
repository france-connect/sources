/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequestObject_F27B_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'F27B';
  static ERROR_CLASS = 'InvalidRequestObject';
  static ERROR_DETAIL = 'could not validate Request Object, err.message';
  static DOCUMENTATION = 'could not validate Request Object, err.message';
  static ERROR_SOURCE = 'actions/authorization/process_request_object.js:189';
  static UI = 'OidcProvider.exceptions.InvalidRequestObject.F27B';
}
