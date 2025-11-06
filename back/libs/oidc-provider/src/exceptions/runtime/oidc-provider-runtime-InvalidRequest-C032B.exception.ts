/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_C032B_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'C032B';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'claims parameter should be a JSON object';
  static DOCUMENTATION = 'claims parameter should be a JSON object';
  static ERROR_SOURCE = 'actions/authorization/check_claims.js:36';
  static UI = 'OidcProvider.exceptions.InvalidRequest.C032B';
}
