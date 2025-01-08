/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_errors_CustomOIDCProviderError_CBED_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'CBED';
  static ERROR_CLASS = 'errors_CustomOIDCProviderError';
  static ERROR_DETAIL = 'request.error, request.errorDescription';
  static DOCUMENTATION = 'request.error, request.errorDescription';
  static ERROR_SOURCE = 'actions/grants/ciba.js:74';
  static UI = 'OidcProvider.exceptions.errors_CustomOIDCProviderError.CBED';
}
