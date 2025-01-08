/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequestObject_4432_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '4432';
  static ERROR_CLASS = 'InvalidRequestObject';
  static ERROR_DETAIL = 'Request Object is missing the aud claim';
  static DOCUMENTATION = 'Request Object is missing the aud claim';
  static ERROR_SOURCE = 'actions/authorization/process_request_object.js:176';
  static UI = 'OidcProvider.exceptions.InvalidRequestObject.4432';
}
