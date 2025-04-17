/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_D87D_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'D87D';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL = 'missing jwt.encrypt.key Resource Server configuration';
  static DOCUMENTATION =
    'missing jwt.encrypt.key Resource Server configuration';
  static ERROR_SOURCE = 'models/formats/jwt.js:73';
  static UI = 'OidcProvider.exceptions.Error.D87D';
}
