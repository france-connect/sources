/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_ExpiredToken_1A45_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '1A45';
  static ERROR_CLASS = 'ExpiredToken';
  static ERROR_DETAIL = 'backchannel authentication request is expired';
  static DOCUMENTATION = 'backchannel authentication request is expired';
  static ERROR_SOURCE = 'actions/grants/ciba.js:55';
  static UI = 'OidcProvider.exceptions.ExpiredToken.1A45';
}
