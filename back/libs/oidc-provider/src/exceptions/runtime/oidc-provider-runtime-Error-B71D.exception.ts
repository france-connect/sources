/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_B71D_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'B71D';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL =
    'unexpected request_uri response status code, expected 200 OK, got ${statusCode} ${STATUS_CODES[statusCode]}';
  static DOCUMENTATION =
    'unexpected request_uri response status code, expected 200 OK, got ${statusCode} ${STATUS_CODES[statusCode]}';
  static ERROR_SOURCE = 'helpers/request_uri_cache.js:32';
  static UI = 'OidcProvider.exceptions.Error.B71D';
}
