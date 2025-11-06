/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientAuth_64868_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '64868';
  static ERROR_CLASS = 'InvalidClientAuth';
  static ERROR_DETAIL =
    'aud (JWT audience) must be provided in the client_assertion JWT';
  static DOCUMENTATION =
    'aud (JWT audience) must be provided in the client_assertion JWT';
  static ERROR_SOURCE = 'shared/jwt_client_auth.js:36';
  static UI = 'OidcProvider.exceptions.InvalidClientAuth.64868';
}
