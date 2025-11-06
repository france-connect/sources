/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_AAA70_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'AAA70';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'claims.id_token should be an object';
  static DOCUMENTATION = 'claims.id_token should be an object';
  static ERROR_SOURCE = 'actions/authorization/check_claims.js:48';
  static UI = 'OidcProvider.exceptions.InvalidRequest.AAA70';
}
