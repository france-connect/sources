/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientAuth_73E3_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '73E3';
  static ERROR_CLASS = 'InvalidClientAuth';
  static ERROR_DETAIL = 'invalid secret provided';
  static DOCUMENTATION = 'invalid secret provided';
  static ERROR_SOURCE = 'shared/token_auth.js:190';
  static UI = 'OidcProvider.exceptions.InvalidClientAuth.73E3';
}
