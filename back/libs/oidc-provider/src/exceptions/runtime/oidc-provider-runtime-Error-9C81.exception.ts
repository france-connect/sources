/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_9C81_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '9C81';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL = 'missing jwt.encrypt.alg Resource Server configuration';
  static DOCUMENTATION =
    'missing jwt.encrypt.alg Resource Server configuration';
  static ERROR_SOURCE = 'models/formats/jwt.js:67';
  static UI = 'OidcProvider.exceptions.Error.9C81';
}
