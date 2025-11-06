/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_C6357_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'C6357';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL =
    'unexpected jwks_uri response status code, expected 200 OK, got ${status} ${STATUS_CODES[status]}';
  static DOCUMENTATION =
    'unexpected jwks_uri response status code, expected 200 OK, got ${status} ${STATUS_CODES[status]}';
  static ERROR_SOURCE = 'models/client.js:186';
  static UI = 'OidcProvider.exceptions.Error.C6357';
}
