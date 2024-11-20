/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidToken_BACD_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'BACD';
  static ERROR_CLASS = 'InvalidToken';
  static ERROR_DETAIL =
    'token audience prevents accessing the userinfo endpoint';
  static DOCUMENTATION =
    'token audience prevents accessing the userinfo endpoint';
  static ERROR_SOURCE = 'actions/userinfo.js:112';
  static UI = 'OidcProvider.exceptions.InvalidToken.BACD';
}
