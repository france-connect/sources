/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_DB11F_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'DB11F';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL = 'sector_identifier_uri must return single JSON array';
  static DOCUMENTATION = 'sector_identifier_uri must return single JSON array';
  static ERROR_SOURCE = 'helpers/sector_validate.js:36';
  static UI = 'OidcProvider.exceptions.Error.DB11F';
}
