/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientAuth_B858_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'B858';
  static ERROR_CLASS = 'InvalidClientAuth';
  static ERROR_DETAIL =
    'audience (aud) must equal the endpoint url, issuer identifier or token endpoint url';
  static DOCUMENTATION =
    'audience (aud) must equal the endpoint url, issuer identifier or token endpoint url';
  static ERROR_SOURCE = 'shared/token_jwt_auth.js:44';
  static UI = 'OidcProvider.exceptions.InvalidClientAuth.B858';
}
