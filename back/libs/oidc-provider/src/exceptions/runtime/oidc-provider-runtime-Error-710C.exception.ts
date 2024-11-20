/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_710C_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '710C';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL =
    'clientBasedCORS helper must be a synchronous function returning a Boolean';
  static DOCUMENTATION =
    'clientBasedCORS helper must be a synchronous function returning a Boolean';
  static ERROR_SOURCE = 'shared/cors.js:13';
  static UI = 'OidcProvider.exceptions.Error.710C';
}
