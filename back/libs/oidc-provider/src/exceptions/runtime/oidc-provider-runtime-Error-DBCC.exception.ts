/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_DBCC_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'DBCC';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL = 'provider key (kid: ${kid}) is invalid';
  static DOCUMENTATION = 'provider key (kid: ${kid}) is invalid';
  static ERROR_SOURCE = 'models/formats/jwt.js:53';
  static UI = 'OidcProvider.exceptions.Error.DBCC';
}
