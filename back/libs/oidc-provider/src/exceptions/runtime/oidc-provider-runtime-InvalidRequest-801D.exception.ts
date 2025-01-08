/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_801D_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '801D';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'claims parameter should have userinfo or id_token properties';
  static DOCUMENTATION =
    'claims parameter should have userinfo or id_token properties';
  static ERROR_SOURCE = 'actions/authorization/check_claims.js:42';
  static UI = 'OidcProvider.exceptions.InvalidRequest.801D';
}
