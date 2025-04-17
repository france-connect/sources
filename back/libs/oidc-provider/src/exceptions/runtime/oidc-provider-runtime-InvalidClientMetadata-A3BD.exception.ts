/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientMetadata_A3BD_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'A3BD';
  static ERROR_CLASS = 'InvalidClientMetadata';
  static ERROR_DETAIL =
    'unexpected sector_identifier_uri response status code, expected 200 OK, got ${statusCode} ${STATUS_CODES[statusCode]}';
  static DOCUMENTATION =
    'unexpected sector_identifier_uri response status code, expected 200 OK, got ${statusCode} ${STATUS_CODES[statusCode]}';
  static ERROR_SOURCE = 'models/client.js:168';
  static UI = 'OidcProvider.exceptions.InvalidClientMetadata.A3BD';
}
