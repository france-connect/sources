/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientAuth_5B34_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '5B34';
  static ERROR_CLASS = 'InvalidClientAuth';
  static ERROR_DETAIL = 'alg mismatch';
  static DOCUMENTATION = 'alg mismatch';
  static ERROR_SOURCE = 'shared/token_jwt_auth.js:12';
  static UI = 'OidcProvider.exceptions.InvalidClientAuth.5B34';
}
