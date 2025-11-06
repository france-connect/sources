/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_3C73B_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '3C73B';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL = 'missing jwt.encrypt.alg Resource Server configuration';
  static DOCUMENTATION =
    'missing jwt.encrypt.alg Resource Server configuration';
  static ERROR_SOURCE = 'models/formats/jwt.js:65';
  static UI = 'OidcProvider.exceptions.Error.3C73B';
}
