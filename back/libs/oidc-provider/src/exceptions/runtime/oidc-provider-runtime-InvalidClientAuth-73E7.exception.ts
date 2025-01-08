/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientAuth_73E7_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '73E7';
  static ERROR_CLASS = 'InvalidClientAuth';
  static ERROR_DETAIL = 'iss (JWT issuer) must be the client_id';
  static DOCUMENTATION = 'iss (JWT issuer) must be the client_id';
  static ERROR_SOURCE = 'shared/token_jwt_auth.js:28';
  static UI = 'OidcProvider.exceptions.InvalidClientAuth.73E7';
}
