/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_CC69_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'CC69';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL = 'features.mTLS.getCertificate function not configured';
  static DOCUMENTATION = 'features.mTLS.getCertificate function not configured';
  static ERROR_SOURCE = 'helpers/defaults.js:41';
  static UI = 'OidcProvider.exceptions.Error.CC69';
}
