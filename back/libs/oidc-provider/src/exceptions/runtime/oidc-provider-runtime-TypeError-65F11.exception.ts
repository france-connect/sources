/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_65F11_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '65F11';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL =
    'HTTP POST Method support requires that cookies.long.sameSite is set to none';
  static DOCUMENTATION =
    'HTTP POST Method support requires that cookies.long.sameSite is set to none';
  static ERROR_SOURCE = 'helpers/configuration.js:416';
  static UI = 'OidcProvider.exceptions.TypeError.65F11';
}
