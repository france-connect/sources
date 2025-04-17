/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientAuth_4262_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '4262';
  static ERROR_CLASS = 'InvalidClientAuth';
  static ERROR_DETAIL = 'unregistered client certificate provided';
  static DOCUMENTATION = 'unregistered client certificate provided';
  static ERROR_SOURCE = 'shared/token_auth.js:259';
  static UI = 'OidcProvider.exceptions.InvalidClientAuth.4262';
}
