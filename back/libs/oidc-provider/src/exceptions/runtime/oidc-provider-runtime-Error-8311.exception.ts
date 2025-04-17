/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_8311_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '8311';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL =
    "client's jwks_uri must be included in the sector_identifier_uri response";
  static DOCUMENTATION =
    "client's jwks_uri must be included in the sector_identifier_uri response";
  static ERROR_SOURCE = 'models/client.js:182';
  static UI = 'OidcProvider.exceptions.Error.8311';
}
