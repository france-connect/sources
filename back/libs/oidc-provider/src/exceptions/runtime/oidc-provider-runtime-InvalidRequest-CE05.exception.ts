/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_CE05_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'CE05';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'response_mode not allowed for this response_type unless encrypted';
  static DOCUMENTATION =
    'response_mode not allowed for this response_type unless encrypted';
  static ERROR_SOURCE = 'actions/authorization/check_response_mode.js:47';
  static UI = 'OidcProvider.exceptions.InvalidRequest.CE05';
}
