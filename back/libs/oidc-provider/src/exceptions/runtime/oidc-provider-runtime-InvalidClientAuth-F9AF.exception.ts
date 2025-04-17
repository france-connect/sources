/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientAuth_F9AF_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'F9AF';
  static ERROR_CLASS = 'InvalidClientAuth';
  static ERROR_DETAIL =
    'expiration must be specified in the client_assertion JWT';
  static DOCUMENTATION =
    'expiration must be specified in the client_assertion JWT';
  static ERROR_SOURCE = 'shared/token_jwt_auth.js:20';
  static UI = 'OidcProvider.exceptions.InvalidClientAuth.F9AF';
}
