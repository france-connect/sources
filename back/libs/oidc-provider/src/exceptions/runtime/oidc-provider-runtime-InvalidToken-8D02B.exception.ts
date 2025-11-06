/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidToken_8D02B_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '8D02B';
  static ERROR_CLASS = 'InvalidToken';
  static ERROR_DETAIL =
    'access token is not sender-constrained but proof of possession was provided';
  static DOCUMENTATION =
    'access token is not sender-constrained but proof of possession was provided';
  static ERROR_SOURCE = 'actions/userinfo.js:115';
  static UI = 'OidcProvider.exceptions.InvalidToken.8D02B';
}
