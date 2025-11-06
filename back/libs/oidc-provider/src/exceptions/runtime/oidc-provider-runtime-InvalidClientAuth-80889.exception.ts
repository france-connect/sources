/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientAuth_80889_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '80889';
  static ERROR_CLASS = 'InvalidClientAuth';
  static ERROR_DETAIL =
    'expiration must be specified in the client_assertion JWT';
  static DOCUMENTATION =
    'expiration must be specified in the client_assertion JWT';
  static ERROR_SOURCE = 'shared/jwt_client_auth.js:20';
  static UI = 'OidcProvider.exceptions.InvalidClientAuth.80889';
}
