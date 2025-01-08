/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidToken_2AAA_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '2AAA';
  static ERROR_CLASS = 'InvalidToken';
  static ERROR_DETAIL = 'failed x5t#S256 verification';
  static DOCUMENTATION = 'failed x5t#S256 verification';
  static ERROR_SOURCE = 'actions/userinfo.js:87';
  static UI = 'OidcProvider.exceptions.InvalidToken.2AAA';
}
