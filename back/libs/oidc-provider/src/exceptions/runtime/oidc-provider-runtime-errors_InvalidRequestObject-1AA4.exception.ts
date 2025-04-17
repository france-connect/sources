/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_errors_InvalidRequestObject_1AA4_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '1AA4';
  static ERROR_CLASS = 'errors_InvalidRequestObject';
  static ERROR_DETAIL = 'Request Object is missing the "nbf" claim';
  static DOCUMENTATION = 'Request Object is missing the "nbf" claim';
  static ERROR_SOURCE = 'helpers/defaults.js:576';
  static UI = 'OidcProvider.exceptions.errors_InvalidRequestObject.1AA4';
}
