/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_EFB2_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'EFB2';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL = 'missing jwt.encrypt.key Resource Server configuration';
  static DOCUMENTATION =
    'missing jwt.encrypt.key Resource Server configuration';
  static ERROR_SOURCE = 'models/formats/jwt.js:74';
  static UI = 'OidcProvider.exceptions.Error.EFB2';
}
