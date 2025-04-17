/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_F812_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'F812';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = '${msg} unless encrypted';
  static DOCUMENTATION = '${msg} unless encrypted';
  static ERROR_SOURCE = 'actions/authorization/check_response_mode.js:50';
  static UI = 'OidcProvider.exceptions.InvalidRequest.F812';
}
