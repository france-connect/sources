/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_3802_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '3802';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'invalid client_assertion format';
  static DOCUMENTATION = 'invalid client_assertion format';
  static ERROR_SOURCE = 'shared/token_auth.js:114';
  static UI = 'OidcProvider.exceptions.InvalidRequest.3802';
}
