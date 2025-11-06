/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequestObject_20621_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '20621';
  static ERROR_CLASS = 'InvalidRequestObject';
  static ERROR_DETAIL = 'could not validate Request Object, err.message';
  static DOCUMENTATION = 'could not validate Request Object, err.message';
  static ERROR_SOURCE = 'actions/authorization/process_request_object.js:188';
  static UI = 'OidcProvider.exceptions.InvalidRequestObject.20621';
}
