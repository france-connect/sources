/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_EC038_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'EC038';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL = 'jwt.sign.kid must be a string when provided';
  static DOCUMENTATION = 'jwt.sign.kid must be a string when provided';
  static ERROR_SOURCE = 'models/formats/jwt.js:54';
  static UI = 'OidcProvider.exceptions.Error.EC038';
}
