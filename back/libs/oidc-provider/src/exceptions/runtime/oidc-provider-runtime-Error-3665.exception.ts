/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_3665_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '3665';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL = 'jwt.encrypt.kid must be a string when provided';
  static DOCUMENTATION = 'jwt.encrypt.kid must be a string when provided';
  static ERROR_SOURCE = 'models/formats/jwt.js:85';
  static UI = 'OidcProvider.exceptions.Error.3665';
}
