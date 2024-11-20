/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_ExpiredToken_B3AF_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'B3AF';
  static ERROR_CLASS = 'ExpiredToken';
  static ERROR_DETAIL = 'device code is expired';
  static DOCUMENTATION = 'device code is expired';
  static ERROR_SOURCE = 'actions/grants/device_code.js:54';
  static UI = 'OidcProvider.exceptions.ExpiredToken.B3AF';
}
