/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_SessionNotFound_B0AE_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'B0AE';
  static ERROR_CLASS = 'SessionNotFound';
  static ERROR_DETAIL = 'session principal changed';
  static DOCUMENTATION = 'session principal changed';
  static ERROR_SOURCE = 'provider.js:48';
  static UI = 'OidcProvider.exceptions.SessionNotFound.B0AE';
}
