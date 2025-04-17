/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_21CC_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '21CC';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'authorization header scheme must be "Bearer"';
  static DOCUMENTATION = 'authorization header scheme must be "Bearer"';
  static ERROR_SOURCE = 'helpers/oidc_context.js:274';
  static UI = 'OidcProvider.exceptions.InvalidRequest.21CC';
}
