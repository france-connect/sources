/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_B388_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'B388';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL =
    'local purpose PASETO Resource Server requires a "paseto.key"';
  static DOCUMENTATION =
    'local purpose PASETO Resource Server requires a "paseto.key"';
  static ERROR_SOURCE = 'models/formats/paseto.js:46';
  static UI = 'OidcProvider.exceptions.Error.B388';
}
