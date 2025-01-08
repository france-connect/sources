/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_EB9D_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'EB9D';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'openid scope must be requested for this request';
  static DOCUMENTATION = 'openid scope must be requested for this request';
  static ERROR_SOURCE = 'actions/authorization/check_openid_scope.js:48';
  static UI = 'OidcProvider.exceptions.InvalidRequest.EB9D';
}
