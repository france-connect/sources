/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientMetadata_1C53_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '1C53';
  static ERROR_CLASS = 'InvalidClientMetadata';
  static ERROR_DETAIL =
    'could not load sector_identifier_uri response, err.message';
  static DOCUMENTATION =
    'could not load sector_identifier_uri response, err.message';
  static ERROR_SOURCE = 'models/client.js:157';
  static UI = 'OidcProvider.exceptions.InvalidClientMetadata.1C53';
}
