/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientAuth_FD7C_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'FD7C';
  static ERROR_CLASS = 'InvalidClientAuth';
  static ERROR_DETAIL =
    'audience (aud) must equal the endpoint url, issuer identifier or token endpoint url';
  static DOCUMENTATION =
    'audience (aud) must equal the endpoint url, issuer identifier or token endpoint url';
  static ERROR_SOURCE = 'shared/token_jwt_auth.js:40';
  static UI = 'OidcProvider.exceptions.InvalidClientAuth.FD7C';
}
