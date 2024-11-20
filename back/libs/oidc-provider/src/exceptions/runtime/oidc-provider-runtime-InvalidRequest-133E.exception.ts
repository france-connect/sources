/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_133E_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '133E';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'openid scope must be requested when using the ${param} parameter';
  static DOCUMENTATION =
    'openid scope must be requested when using the ${param} parameter';
  static ERROR_SOURCE = 'actions/authorization/check_openid_scope.js:43';
  static UI = 'OidcProvider.exceptions.InvalidRequest.133E';
}
