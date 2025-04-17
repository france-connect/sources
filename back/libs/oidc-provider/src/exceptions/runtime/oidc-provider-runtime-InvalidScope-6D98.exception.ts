/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidScope_6D98_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '6D98';
  static ERROR_CLASS = 'InvalidScope';
  static ERROR_DETAIL = 'requested scope is not allowed, scope';
  static DOCUMENTATION = 'requested scope is not allowed, scope';
  static ERROR_SOURCE = 'actions/grants/client_credentials.js:35';
  static UI = 'OidcProvider.exceptions.InvalidScope.6D98';
}
