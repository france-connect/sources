/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_F774_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'F774';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL =
    'local purpose PASETO Resource Server "paseto.key" must be 256 bits long secret key';
  static DOCUMENTATION =
    'local purpose PASETO Resource Server "paseto.key" must be 256 bits long secret key';
  static ERROR_SOURCE = 'models/formats/paseto.js:52';
  static UI = 'OidcProvider.exceptions.Error.F774';
}
