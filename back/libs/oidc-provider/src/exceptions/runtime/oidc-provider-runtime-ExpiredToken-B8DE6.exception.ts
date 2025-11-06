/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_ExpiredToken_B8DE6_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'B8DE6';
  static ERROR_CLASS = 'ExpiredToken';
  static ERROR_DETAIL = 'backchannel authentication request is expired';
  static DOCUMENTATION = 'backchannel authentication request is expired';
  static ERROR_SOURCE = 'actions/grants/ciba.js:67';
  static UI = 'OidcProvider.exceptions.ExpiredToken.B8DE6';
}
