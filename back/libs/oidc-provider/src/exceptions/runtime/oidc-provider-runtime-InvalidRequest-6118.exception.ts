/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_6118_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '6118';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'claims parameter should not be combined with response_type none';
  static DOCUMENTATION =
    'claims parameter should not be combined with response_type none';
  static ERROR_SOURCE = 'actions/authorization/check_claims.js:24';
  static UI = 'OidcProvider.exceptions.InvalidRequest.6118';
}
