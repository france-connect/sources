/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidToken_46BD3_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '46BD3';
  static ERROR_CLASS = 'InvalidToken';
  static ERROR_DETAIL = 'grant is expired';
  static DOCUMENTATION = 'grant is expired';
  static ERROR_SOURCE = 'actions/userinfo.js:179';
  static UI = 'OidcProvider.exceptions.InvalidToken.46BD3';
}
