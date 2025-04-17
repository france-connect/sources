/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_E08B_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'E08B';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL =
    'jwtUserinfo is only available in conjuction with userinfo';
  static DOCUMENTATION =
    'jwtUserinfo is only available in conjuction with userinfo';
  static ERROR_SOURCE = 'helpers/configuration.js:393';
  static UI = 'OidcProvider.exceptions.TypeError.E08B';
}
