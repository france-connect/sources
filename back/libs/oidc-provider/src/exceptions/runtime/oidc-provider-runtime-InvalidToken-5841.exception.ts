/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidToken_5841_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '5841';
  static ERROR_CLASS = 'InvalidToken';
  static ERROR_DETAIL = 'failed x5t#S256 verification';
  static DOCUMENTATION = 'failed x5t#S256 verification';
  static ERROR_SOURCE = 'actions/userinfo.js:84';
  static UI = 'OidcProvider.exceptions.InvalidToken.5841';
}
