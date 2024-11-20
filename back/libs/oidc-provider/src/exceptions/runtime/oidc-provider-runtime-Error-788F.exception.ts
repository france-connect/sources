/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_788F_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '788F';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL = 'missing jwt.encrypt.enc Resource Server configuration';
  static DOCUMENTATION =
    'missing jwt.encrypt.enc Resource Server configuration';
  static ERROR_SOURCE = 'models/formats/jwt.js:71';
  static UI = 'OidcProvider.exceptions.Error.788F';
}
