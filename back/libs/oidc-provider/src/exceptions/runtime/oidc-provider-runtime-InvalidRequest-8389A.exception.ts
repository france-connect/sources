/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_8389A_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '8389A';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'authorization_details is unsupported at the ${ctx.oidc.route}_endpoint';
  static DOCUMENTATION =
    'authorization_details is unsupported at the ${ctx.oidc.route}_endpoint';
  static ERROR_SOURCE = 'actions/authorization/unsupported_rar.js:5';
  static UI = 'OidcProvider.exceptions.InvalidRequest.8389A';
}
