/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InsufficientScope_6ABD_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '6ABD';
  static ERROR_CLASS = 'InsufficientScope';
  static ERROR_DETAIL = 'access token missing requested scope, missing.join( )';
  static DOCUMENTATION =
    'access token missing requested scope, missing.join( )';
  static ERROR_SOURCE = 'actions/userinfo.js:123';
  static UI = 'OidcProvider.exceptions.InsufficientScope.6ABD';
}
