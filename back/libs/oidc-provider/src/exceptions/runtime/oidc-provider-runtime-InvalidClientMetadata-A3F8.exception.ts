/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientMetadata_A3F8_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'A3F8';
  static ERROR_CLASS = 'InvalidClientMetadata';
  static ERROR_DETAIL =
    'client_id is mandatory property for statically configured clients';
  static DOCUMENTATION =
    'client_id is mandatory property for statically configured clients';
  static ERROR_SOURCE = 'models/client.js:377';
  static UI = 'OidcProvider.exceptions.InvalidClientMetadata.A3F8';
}
