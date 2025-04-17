/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_B012_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'B012';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL = 'jwt issuer invalid';
  static DOCUMENTATION = 'jwt issuer invalid';
  static ERROR_SOURCE = 'helpers/jwt.js:133';
  static UI = 'OidcProvider.exceptions.Error.B012';
}
