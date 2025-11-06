/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_B2B69_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'B2B69';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'Request Object must be used by this client';
  static DOCUMENTATION = 'Request Object must be used by this client';
  static ERROR_SOURCE = 'actions/authorization/process_request_object.js:28';
  static UI = 'OidcProvider.exceptions.InvalidRequest.B2B69';
}
