/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_C4E15_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'C4E15';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'claims.userinfo should not be used if access_token is not issued';
  static DOCUMENTATION =
    'claims.userinfo should not be used if access_token is not issued';
  static ERROR_SOURCE = 'actions/authorization/check_claims.js:56';
  static UI = 'OidcProvider.exceptions.InvalidRequest.C4E15';
}
