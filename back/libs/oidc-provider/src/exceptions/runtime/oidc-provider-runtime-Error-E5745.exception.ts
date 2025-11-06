/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_E5745_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'E5745';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL = 'jwt audience missing ${expected}';
  static DOCUMENTATION = 'jwt audience missing ${expected}';
  static ERROR_SOURCE = 'helpers/jwt.js:20';
  static UI = 'OidcProvider.exceptions.Error.E5745';
}
