/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_C539_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'C539';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'claims.userinfo should be an object';
  static DOCUMENTATION = 'claims.userinfo should be an object';
  static ERROR_SOURCE = 'actions/authorization/check_claims.js:46';
  static UI = 'OidcProvider.exceptions.InvalidRequest.C539';
}
