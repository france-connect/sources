/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_errors_InvalidRequestObject_6259_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '6259';
  static ERROR_CLASS = 'errors_InvalidRequestObject';
  static ERROR_DETAIL = 'Request Object "exp" claim too far from "nbf" claim';
  static DOCUMENTATION = 'Request Object "exp" claim too far from "nbf" claim';
  static ERROR_SOURCE = 'helpers/defaults.js:595';
  static UI = 'OidcProvider.exceptions.errors_InvalidRequestObject.6259';
}
