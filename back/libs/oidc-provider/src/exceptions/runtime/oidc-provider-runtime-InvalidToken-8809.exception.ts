/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidToken_8809_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '8809';
  static ERROR_CLASS = 'InvalidToken';
  static ERROR_DETAIL = 'clientId mismatch';
  static DOCUMENTATION = 'clientId mismatch';
  static ERROR_SOURCE = 'actions/userinfo.js:165';
  static UI = 'OidcProvider.exceptions.InvalidToken.8809';
}
