/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidScope_22EE_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '22EE';
  static ERROR_CLASS = 'InvalidScope';
  static ERROR_DETAIL = 'requested scope is not allowed, scope';
  static DOCUMENTATION = 'requested scope is not allowed, scope';
  static ERROR_SOURCE = 'actions/authorization/check_scope.js:49';
  static UI = 'OidcProvider.exceptions.InvalidScope.22EE';
}
