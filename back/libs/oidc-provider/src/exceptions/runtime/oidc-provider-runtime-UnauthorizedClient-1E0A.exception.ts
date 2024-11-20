/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_UnauthorizedClient_1E0A_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '1E0A';
  static ERROR_CLASS = 'UnauthorizedClient';
  static ERROR_DETAIL =
    'requested response_type is not allowed for this client';
  static DOCUMENTATION =
    'requested response_type is not allowed for this client';
  static ERROR_SOURCE = 'actions/authorization/check_response_type.js:25';
  static UI = 'OidcProvider.exceptions.UnauthorizedClient.1E0A';
}
