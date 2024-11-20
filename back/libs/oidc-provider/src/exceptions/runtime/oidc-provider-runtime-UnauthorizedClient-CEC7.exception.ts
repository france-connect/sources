/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_UnauthorizedClient_CEC7_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'CEC7';
  static ERROR_CLASS = 'UnauthorizedClient';
  static ERROR_DETAIL = '${grantType} is not allowed for this client';
  static DOCUMENTATION = '${grantType} is not allowed for this client';
  static ERROR_SOURCE = 'actions/authorization/check_client_grant_type.js:17';
  static UI = 'OidcProvider.exceptions.UnauthorizedClient.CEC7';
}
