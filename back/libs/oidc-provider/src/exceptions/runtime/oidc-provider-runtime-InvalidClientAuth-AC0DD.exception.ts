/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientAuth_AC0DD_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'AC0DD';
  static ERROR_CLASS = 'InvalidClientAuth';
  static ERROR_DETAIL =
    'iss (JWT issuer) must be provided in the client_assertion JWT';
  static DOCUMENTATION =
    'iss (JWT issuer) must be provided in the client_assertion JWT';
  static ERROR_SOURCE = 'shared/jwt_client_auth.js:28';
  static UI = 'OidcProvider.exceptions.InvalidClientAuth.AC0DD';
}
