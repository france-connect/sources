/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_20EF_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '20EF';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'claims parameter should have userinfo or id_token properties';
  static DOCUMENTATION =
    'claims parameter should have userinfo or id_token properties';
  static ERROR_SOURCE = 'actions/authorization/check_claims.js:40';
  static UI = 'OidcProvider.exceptions.InvalidRequest.20EF';
}
