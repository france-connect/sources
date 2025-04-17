/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_errors_InvalidRequestObject_8D99_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '8D99';
  static ERROR_CLASS = 'errors_InvalidRequestObject';
  static ERROR_DETAIL = 'Request Object is missing the "aud" claim';
  static DOCUMENTATION = 'Request Object is missing the "aud" claim';
  static ERROR_SOURCE = 'helpers/defaults.js:573';
  static UI = 'OidcProvider.exceptions.errors_InvalidRequestObject.8D99';
}
