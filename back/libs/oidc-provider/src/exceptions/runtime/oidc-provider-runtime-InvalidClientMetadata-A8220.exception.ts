/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientMetadata_A8220_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'A8220';
  static ERROR_CLASS = 'InvalidClientMetadata';
  static ERROR_DETAIL =
    'unexpected sector_identifier_uri response status code, expected 200 OK, got ${response.status} ${STATUS_CODES[response.status]}';
  static DOCUMENTATION =
    'unexpected sector_identifier_uri response status code, expected 200 OK, got ${response.status} ${STATUS_CODES[response.status]}';
  static ERROR_SOURCE = 'helpers/sector_validate.js:25';
  static UI = 'OidcProvider.exceptions.InvalidClientMetadata.A8220';
}
