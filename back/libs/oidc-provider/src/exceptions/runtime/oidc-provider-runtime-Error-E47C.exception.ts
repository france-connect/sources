/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_E47C_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'E47C';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL = 'jwt.encrypt.kid must be a string when provided';
  static DOCUMENTATION = 'jwt.encrypt.kid must be a string when provided';
  static ERROR_SOURCE = 'models/formats/jwt.js:84';
  static UI = 'OidcProvider.exceptions.Error.E47C';
}
