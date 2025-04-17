/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientMetadata_F941_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'F941';
  static ERROR_CLASS = 'InvalidClientMetadata';
  static ERROR_DETAIL = 'client JSON Web Key Set is invalid';
  static DOCUMENTATION = 'client JSON Web Key Set is invalid';
  static ERROR_SOURCE = 'models/client.js:54';
  static UI = 'OidcProvider.exceptions.InvalidClientMetadata.F941';
}
