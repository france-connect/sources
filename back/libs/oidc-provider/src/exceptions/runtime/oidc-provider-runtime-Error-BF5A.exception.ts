/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_BF5A_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'BF5A';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL =
    'features.mTLS.certificateSubjectMatches function not configured';
  static DOCUMENTATION =
    'features.mTLS.certificateSubjectMatches function not configured';
  static ERROR_SOURCE = 'helpers/defaults.js:52';
  static UI = 'OidcProvider.exceptions.Error.BF5A';
}
