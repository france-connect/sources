/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidScope_4D706_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '4D706';
  static ERROR_CLASS = 'InvalidScope';
  static ERROR_DETAIL = 'requested scope is not allowed, scope';
  static DOCUMENTATION = 'requested scope is not allowed, scope';
  static ERROR_SOURCE = 'actions/authorization/check_scope.js:47';
  static UI = 'OidcProvider.exceptions.InvalidScope.4D706';
}
