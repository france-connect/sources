/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientAuth_21A2A_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '21A2A';
  static ERROR_CLASS = 'InvalidClientAuth';
  static ERROR_DETAIL = 'iss (JWT issuer) must be the client_id';
  static DOCUMENTATION = 'iss (JWT issuer) must be the client_id';
  static ERROR_SOURCE = 'shared/jwt_client_auth.js:32';
  static UI = 'OidcProvider.exceptions.InvalidClientAuth.21A2A';
}
