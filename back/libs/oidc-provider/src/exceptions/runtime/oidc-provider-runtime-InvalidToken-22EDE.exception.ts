/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidToken_22EDE_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '22EDE';
  static ERROR_CLASS = 'InvalidToken';
  static ERROR_DETAIL = 'accountId mismatch';
  static DOCUMENTATION = 'accountId mismatch';
  static ERROR_SOURCE = 'actions/userinfo.js:187';
  static UI = 'OidcProvider.exceptions.InvalidToken.22EDE';
}
