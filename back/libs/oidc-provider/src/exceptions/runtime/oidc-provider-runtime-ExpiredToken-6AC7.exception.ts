/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_ExpiredToken_6AC7_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '6AC7';
  static ERROR_CLASS = 'ExpiredToken';
  static ERROR_DETAIL = 'backchannel authentication request is expired';
  static DOCUMENTATION = 'backchannel authentication request is expired';
  static ERROR_SOURCE = 'actions/grants/ciba.js:66';
  static UI = 'OidcProvider.exceptions.ExpiredToken.6AC7';
}
