/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientAuth_CB6B_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'CB6B';
  static ERROR_CLASS = 'InvalidClientAuth';
  static ERROR_DETAIL = 'client assertion tokens must only be used once';
  static DOCUMENTATION = 'client assertion tokens must only be used once';
  static ERROR_SOURCE = 'shared/token_jwt_auth.js:57';
  static UI = 'OidcProvider.exceptions.InvalidClientAuth.CB6B';
}
