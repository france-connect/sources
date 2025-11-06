/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidToken_2B72B_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '2B72B';
  static ERROR_CLASS = 'InvalidToken';
  static ERROR_DETAIL = 'failed x5t#S256 verification';
  static DOCUMENTATION = 'failed x5t#S256 verification';
  static ERROR_SOURCE = 'actions/userinfo.js:97';
  static UI = 'OidcProvider.exceptions.InvalidToken.2B72B';
}
