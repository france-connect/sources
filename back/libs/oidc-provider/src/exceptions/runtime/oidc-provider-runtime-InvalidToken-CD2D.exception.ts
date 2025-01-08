/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidToken_CD2D_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'CD2D';
  static ERROR_CLASS = 'InvalidToken';
  static ERROR_DETAIL = 'grant is expired';
  static DOCUMENTATION = 'grant is expired';
  static ERROR_SOURCE = 'actions/userinfo.js:161';
  static UI = 'OidcProvider.exceptions.InvalidToken.CD2D';
}
