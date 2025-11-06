/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientMetadata_179D0_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '179D0';
  static ERROR_CLASS = 'InvalidClientMetadata';
  static ERROR_DETAIL =
    'client_id is mandatory property for statically configured clients';
  static DOCUMENTATION =
    'client_id is mandatory property for statically configured clients';
  static ERROR_SOURCE = 'helpers/initialize_clients.js:10';
  static UI = 'OidcProvider.exceptions.InvalidClientMetadata.179D0';
}
