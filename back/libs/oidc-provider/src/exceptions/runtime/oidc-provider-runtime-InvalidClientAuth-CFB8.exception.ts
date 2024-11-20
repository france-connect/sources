/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientAuth_CFB8_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'CFB8';
  static ERROR_CLASS = 'InvalidClientAuth';
  static ERROR_DETAIL =
    'list of audience (aud) must include the endpoint url, issuer identifier or token endpoint url';
  static DOCUMENTATION =
    'list of audience (aud) must include the endpoint url, issuer identifier or token endpoint url';
  static ERROR_SOURCE = 'shared/token_jwt_auth.js:37';
  static UI = 'OidcProvider.exceptions.InvalidClientAuth.CFB8';
}
