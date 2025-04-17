/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidToken_1EEC_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '1EEC';
  static ERROR_CLASS = 'InvalidToken';
  static ERROR_DETAIL = 'accountId mismatch';
  static DOCUMENTATION = 'accountId mismatch';
  static ERROR_SOURCE = 'actions/userinfo.js:170';
  static UI = 'OidcProvider.exceptions.InvalidToken.1EEC';
}
