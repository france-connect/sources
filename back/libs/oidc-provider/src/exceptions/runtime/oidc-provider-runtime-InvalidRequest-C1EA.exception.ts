/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_C1EA_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'C1EA';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'claims parameter should not be combined with response_type none';
  static DOCUMENTATION =
    'claims parameter should not be combined with response_type none';
  static ERROR_SOURCE = 'actions/authorization/check_claims.js:26';
  static UI = 'OidcProvider.exceptions.InvalidRequest.C1EA';
}
