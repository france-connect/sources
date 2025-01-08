/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientMetadata_DADD_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'DADD';
  static ERROR_CLASS = 'InvalidClientMetadata';
  static ERROR_DETAIL =
    'client_id is mandatory property for statically configured clients';
  static DOCUMENTATION =
    'client_id is mandatory property for statically configured clients';
  static ERROR_SOURCE = 'models/client.js:384';
  static UI = 'OidcProvider.exceptions.InvalidClientMetadata.DADD';
}
