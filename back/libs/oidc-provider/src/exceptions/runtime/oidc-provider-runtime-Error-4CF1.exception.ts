/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_4CF1_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '4CF1';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL = 'jwt.sign.kid must be a string when provided';
  static DOCUMENTATION = 'jwt.sign.kid must be a string when provided';
  static ERROR_SOURCE = 'models/formats/jwt.js:56';
  static UI = 'OidcProvider.exceptions.Error.4CF1';
}
