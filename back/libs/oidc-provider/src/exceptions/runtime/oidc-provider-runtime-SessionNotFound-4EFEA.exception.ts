/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_SessionNotFound_4EFEA_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '4EFEA';
  static ERROR_CLASS = 'SessionNotFound';
  static ERROR_DETAIL = 'interaction session id cookie not found';
  static DOCUMENTATION = 'interaction session id cookie not found';
  static ERROR_SOURCE = 'provider.js:385';
  static UI = 'OidcProvider.exceptions.SessionNotFound.4EFEA';
}
