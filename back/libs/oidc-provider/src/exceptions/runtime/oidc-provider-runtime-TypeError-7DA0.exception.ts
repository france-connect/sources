/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_7DA0_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '7DA0';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL =
    'jwtUserinfo is only available in conjuction with userinfo';
  static DOCUMENTATION =
    'jwtUserinfo is only available in conjuction with userinfo';
  static ERROR_SOURCE = 'helpers/configuration.js:376';
  static UI = 'OidcProvider.exceptions.TypeError.7DA0';
}
