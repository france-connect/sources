/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_F3E3_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'F3E3';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'openid scope must be requested for clients with ${msg}';
  static DOCUMENTATION =
    'openid scope must be requested for clients with ${msg}';
  static ERROR_SOURCE = 'actions/authorization/check_openid_scope.js:35';
  static UI = 'OidcProvider.exceptions.InvalidRequest.F3E3';
}
