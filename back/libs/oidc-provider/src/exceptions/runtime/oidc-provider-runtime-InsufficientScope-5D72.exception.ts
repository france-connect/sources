/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InsufficientScope_5D72_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '5D72';
  static ERROR_CLASS = 'InsufficientScope';
  static ERROR_DETAIL =
    'access token missing requested scope, missing.join(" ")';
  static DOCUMENTATION =
    'access token missing requested scope, missing.join(" ")';
  static ERROR_SOURCE = 'actions/userinfo.js:124';
  static UI = 'OidcProvider.exceptions.InsufficientScope.5D72';
}
