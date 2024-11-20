/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_AD03_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'AD03';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL =
    '${property} certificate subject matching not implemented';
  static DOCUMENTATION =
    '${property} certificate subject matching not implemented';
  static ERROR_SOURCE = 'helpers/defaults.js:1144';
  static UI = 'OidcProvider.exceptions.Error.AD03';
}
