/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_DE17_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'DE17';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL = 'invalid nbf value';
  static DOCUMENTATION = 'invalid nbf value';
  static ERROR_SOURCE = 'helpers/jwt.js:97';
  static UI = 'OidcProvider.exceptions.Error.DE17';
}
