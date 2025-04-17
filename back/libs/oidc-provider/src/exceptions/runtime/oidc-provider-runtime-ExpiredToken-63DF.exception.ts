/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_ExpiredToken_63DF_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '63DF';
  static ERROR_CLASS = 'ExpiredToken';
  static ERROR_DETAIL = 'device code is expired';
  static DOCUMENTATION = 'device code is expired';
  static ERROR_SOURCE = 'actions/grants/device_code.js:65';
  static UI = 'OidcProvider.exceptions.ExpiredToken.63DF';
}
