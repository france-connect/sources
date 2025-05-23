/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_81C5_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '81C5';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'claims.userinfo should not be used since userinfo endpoint is not supported';
  static DOCUMENTATION =
    'claims.userinfo should not be used since userinfo endpoint is not supported';
  static ERROR_SOURCE = 'actions/authorization/check_claims.js:52';
  static UI = 'OidcProvider.exceptions.InvalidRequest.81C5';
}
