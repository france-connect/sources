/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_BF10_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'BF10';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL =
    'all registered redirect_uris must be included in the sector_identifier_uri response';
  static DOCUMENTATION =
    'all registered redirect_uris must be included in the sector_identifier_uri response';
  static ERROR_SOURCE = 'models/client.js:175';
  static UI = 'OidcProvider.exceptions.Error.BF10';
}
