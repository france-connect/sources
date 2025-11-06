/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_29C56_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '29C56';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'requested response_type is not allowed for this client';
  static DOCUMENTATION =
    'requested response_type is not allowed for this client';
  static ERROR_SOURCE = 'actions/authorization/check_response_type.js:22';
  static UI = 'OidcProvider.exceptions.InvalidRequest.29C56';
}
