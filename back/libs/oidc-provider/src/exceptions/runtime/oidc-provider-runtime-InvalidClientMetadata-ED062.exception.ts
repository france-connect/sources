/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientMetadata_ED062_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'ED062';
  static ERROR_CLASS = 'InvalidClientMetadata';
  static ERROR_DETAIL =
    'could not load sector_identifier_uri response, err.message';
  static DOCUMENTATION =
    'could not load sector_identifier_uri response, err.message';
  static ERROR_SOURCE = 'helpers/sector_validate.js:21';
  static UI = 'OidcProvider.exceptions.InvalidClientMetadata.ED062';
}
