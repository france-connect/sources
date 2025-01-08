/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_9EE8_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '9EE8';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL = 'jwt.sign.kid must be a string when provided';
  static DOCUMENTATION = 'jwt.sign.kid must be a string when provided';
  static ERROR_SOURCE = 'models/formats/jwt.js:57';
  static UI = 'OidcProvider.exceptions.Error.9EE8';
}
