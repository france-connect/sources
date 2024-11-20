/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_E8D0_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'E8D0';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL = 'JWT Access Tokens may not use JWS algorithm none';
  static DOCUMENTATION = 'JWT Access Tokens may not use JWS algorithm none';
  static ERROR_SOURCE = 'models/formats/jwt.js:34';
  static UI = 'OidcProvider.exceptions.Error.E8D0';
}
