/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_DCD6_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'DCD6';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL =
    'unexpected jwks_uri response status code, expected 200 OK, got ${statusCode} ${STATUS_CODES[statusCode]}';
  static DOCUMENTATION =
    'unexpected jwks_uri response status code, expected 200 OK, got ${statusCode} ${STATUS_CODES[statusCode]}';
  static ERROR_SOURCE = 'models/client.js:255';
  static UI = 'OidcProvider.exceptions.Error.DCD6';
}
