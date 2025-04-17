/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_64DE_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '64DE';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'openid scope must be requested for this response_type';
  static DOCUMENTATION =
    'openid scope must be requested for this response_type';
  static ERROR_SOURCE = 'actions/authorization/check_openid_scope.js:30';
  static UI = 'OidcProvider.exceptions.InvalidRequest.64DE';
}
