/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_6A24_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '6A24';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'requested response_mode is not allowed for this client or request';
  static DOCUMENTATION =
    'requested response_mode is not allowed for this client or request';
  static ERROR_SOURCE = 'actions/authorization/check_response_mode.js:25';
  static UI = 'OidcProvider.exceptions.InvalidRequest.6A24';
}
