/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_ABF3B_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'ABF3B';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL =
    'err.message || "keystore must be a JSON Web Key Set formatted object", { cause: err }';
  static DOCUMENTATION =
    'err.message || "keystore must be a JSON Web Key Set formatted object", { cause: err }';
  static ERROR_SOURCE = 'helpers/initialize_keystore.js:269';
  static UI = 'OidcProvider.exceptions.Error.ABF3B';
}
