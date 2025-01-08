/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidToken_BB15_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'BB15';
  static ERROR_CLASS = 'InvalidToken';
  static ERROR_DETAIL = 'failed jkt verification';
  static DOCUMENTATION = 'failed jkt verification';
  static ERROR_SOURCE = 'actions/userinfo.js:102';
  static UI = 'OidcProvider.exceptions.InvalidToken.BB15';
}
