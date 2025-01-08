/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_6225_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '6225';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL =
    'err instanceof AssertionError ? err.message : keystore must be a JSON Web Key Set formatted object';
  static DOCUMENTATION =
    'err instanceof AssertionError ? err.message : keystore must be a JSON Web Key Set formatted object';
  static ERROR_SOURCE = 'helpers/initialize_keystore.js:235';
  static UI = 'OidcProvider.exceptions.Error.6225';
}
