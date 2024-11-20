/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidToken_8648_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '8648';
  static ERROR_CLASS = 'InvalidToken';
  static ERROR_DETAIL = 'client mismatch';
  static DOCUMENTATION = 'client mismatch';
  static ERROR_SOURCE = 'actions/registration.js:46';
  static UI = 'OidcProvider.exceptions.InvalidToken.8648';
}
