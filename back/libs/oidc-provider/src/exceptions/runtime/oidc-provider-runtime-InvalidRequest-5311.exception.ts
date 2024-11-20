/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_5311_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '5311';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'openid scope must be requested for clients with ${msg}';
  static DOCUMENTATION =
    'openid scope must be requested for clients with ${msg}';
  static ERROR_SOURCE = 'actions/authorization/check_openid_scope.js:37';
  static UI = 'OidcProvider.exceptions.InvalidRequest.5311';
}
