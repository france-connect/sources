/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_SessionNotFound_A8D0_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'A8D0';
  static ERROR_CLASS = 'SessionNotFound';
  static ERROR_DETAIL = 'interaction session id cookie not found';
  static DOCUMENTATION = 'interaction session id cookie not found';
  static ERROR_SOURCE = 'provider.js:35';
  static UI = 'OidcProvider.exceptions.SessionNotFound.A8D0';
}
