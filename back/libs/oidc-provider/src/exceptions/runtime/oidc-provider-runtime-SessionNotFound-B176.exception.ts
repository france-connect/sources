/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_SessionNotFound_B176_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'B176';
  static ERROR_CLASS = 'SessionNotFound';
  static ERROR_DETAIL = 'interaction session id cookie not found';
  static DOCUMENTATION = 'interaction session id cookie not found';
  static ERROR_SOURCE = 'provider.js:58';
  static UI = 'OidcProvider.exceptions.SessionNotFound.B176';
}
