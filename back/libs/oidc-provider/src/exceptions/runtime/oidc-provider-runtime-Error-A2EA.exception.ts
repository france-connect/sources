/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_A2EA_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'A2EA';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL = 'jwt audience missing ${expected}';
  static DOCUMENTATION = 'jwt audience missing ${expected}';
  static ERROR_SOURCE = 'helpers/jwt.js:26';
  static UI = 'OidcProvider.exceptions.Error.A2EA';
}
