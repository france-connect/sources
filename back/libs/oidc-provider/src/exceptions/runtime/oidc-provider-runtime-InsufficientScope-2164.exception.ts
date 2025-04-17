/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InsufficientScope_2164_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '2164';
  static ERROR_CLASS = 'InsufficientScope';
  static ERROR_DETAIL = 'access token missing openid scope, openid';
  static DOCUMENTATION = 'access token missing openid scope, openid';
  static ERROR_SOURCE = 'actions/userinfo.js:77';
  static UI = 'OidcProvider.exceptions.InsufficientScope.2164';
}
