/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientMetadata_4DE0_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '4DE0';
  static ERROR_CLASS = 'InvalidClientMetadata';
  static ERROR_DETAIL =
    'client_id must be unique amongst statically configured clients';
  static DOCUMENTATION =
    'client_id must be unique amongst statically configured clients';
  static ERROR_SOURCE = 'models/client.js:381';
  static UI = 'OidcProvider.exceptions.InvalidClientMetadata.4DE0';
}
