/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_21061_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '21061';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL = 'missing jwt.encrypt.enc Resource Server configuration';
  static DOCUMENTATION =
    'missing jwt.encrypt.enc Resource Server configuration';
  static ERROR_SOURCE = 'models/formats/jwt.js:68';
  static UI = 'OidcProvider.exceptions.Error.21061';
}
