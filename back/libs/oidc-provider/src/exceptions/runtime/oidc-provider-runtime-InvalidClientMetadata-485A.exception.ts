/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientMetadata_485A_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '485A';
  static ERROR_CLASS = 'InvalidClientMetadata';
  static ERROR_DETAIL =
    'client JSON Web Key Set failed to be refreshed, err.error_description || err.message';
  static DOCUMENTATION =
    'client JSON Web Key Set failed to be refreshed, err.error_description || err.message';
  static ERROR_SOURCE = 'models/client.js:270';
  static UI = 'OidcProvider.exceptions.InvalidClientMetadata.485A';
}
