/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidToken_FAE2_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'FAE2';
  static ERROR_CLASS = 'InvalidToken';
  static ERROR_DETAIL = 'clientId mismatch';
  static DOCUMENTATION = 'clientId mismatch';
  static ERROR_SOURCE = 'actions/userinfo.js:166';
  static UI = 'OidcProvider.exceptions.InvalidToken.FAE2';
}
