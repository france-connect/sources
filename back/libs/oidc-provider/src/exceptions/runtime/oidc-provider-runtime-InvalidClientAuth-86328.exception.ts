/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientAuth_86328_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '86328';
  static ERROR_CLASS = 'InvalidClientAuth';
  static ERROR_DETAIL = 'client assertion tokens must only be used once';
  static DOCUMENTATION = 'client assertion tokens must only be used once';
  static ERROR_SOURCE = 'shared/jwt_client_auth.js:70';
  static UI = 'OidcProvider.exceptions.InvalidClientAuth.86328';
}
