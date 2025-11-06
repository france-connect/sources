/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientMetadata_52B92_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '52B92';
  static ERROR_CLASS = 'InvalidClientMetadata';
  static ERROR_DETAIL =
    'client_id must be unique amongst statically configured clients';
  static DOCUMENTATION =
    'client_id must be unique amongst statically configured clients';
  static ERROR_SOURCE = 'helpers/initialize_clients.js:14';
  static UI = 'OidcProvider.exceptions.InvalidClientMetadata.52B92';
}
