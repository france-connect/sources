/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_errors_InvalidRequestObject_74E2_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '74E2';
  static ERROR_CLASS = 'errors_InvalidRequestObject';
  static ERROR_DETAIL = 'Request Object is missing the "exp" claim';
  static DOCUMENTATION = 'Request Object is missing the "exp" claim';
  static ERROR_SOURCE = 'helpers/defaults.js:568';
  static UI = 'OidcProvider.exceptions.errors_InvalidRequestObject.74E2';
}
