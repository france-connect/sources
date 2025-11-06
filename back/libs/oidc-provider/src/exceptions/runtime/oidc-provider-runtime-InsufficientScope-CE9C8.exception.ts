/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InsufficientScope_CE9C8_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'CE9C8';
  static ERROR_CLASS = 'InsufficientScope';
  static ERROR_DETAIL =
    'access token missing requested scope, missing.join(" ")';
  static DOCUMENTATION =
    'access token missing requested scope, missing.join(" ")';
  static ERROR_SOURCE = 'actions/userinfo.js:141';
  static UI = 'OidcProvider.exceptions.InsufficientScope.CE9C8';
}
