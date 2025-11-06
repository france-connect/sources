/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientAuth_E1284_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'E1284';
  static ERROR_CLASS = 'InvalidClientAuth';
  static ERROR_DETAIL = 'unregistered client certificate provided';
  static DOCUMENTATION = 'unregistered client certificate provided';
  static ERROR_SOURCE = 'shared/client_auth.js:258';
  static UI = 'OidcProvider.exceptions.InvalidClientAuth.E1284';
}
