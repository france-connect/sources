/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientAuth_FF15_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'FF15';
  static ERROR_CLASS = 'InvalidClientAuth';
  static ERROR_DETAIL = 'client assertion tokens must only be used once';
  static DOCUMENTATION = 'client assertion tokens must only be used once';
  static ERROR_SOURCE = 'shared/token_jwt_auth.js:70';
  static UI = 'OidcProvider.exceptions.InvalidClientAuth.FF15';
}
