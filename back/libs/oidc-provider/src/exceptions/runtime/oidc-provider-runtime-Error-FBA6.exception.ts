/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_FBA6_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'FBA6';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL =
    'features.mTLS.certificateAuthorized function not configured';
  static DOCUMENTATION =
    'features.mTLS.certificateAuthorized function not configured';
  static ERROR_SOURCE = 'helpers/defaults.js:46';
  static UI = 'OidcProvider.exceptions.Error.FBA6';
}
