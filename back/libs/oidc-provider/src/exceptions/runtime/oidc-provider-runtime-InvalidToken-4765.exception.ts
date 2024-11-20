/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidToken_4765_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '4765';
  static ERROR_CLASS = 'InvalidToken';
  static ERROR_DETAIL = 'accountId mismatch';
  static DOCUMENTATION = 'accountId mismatch';
  static ERROR_SOURCE = 'actions/userinfo.js:169';
  static UI = 'OidcProvider.exceptions.InvalidToken.4765';
}
