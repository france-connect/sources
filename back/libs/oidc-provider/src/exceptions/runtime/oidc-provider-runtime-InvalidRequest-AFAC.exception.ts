/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_AFAC_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'AFAC';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'claims parameter should be a JSON object';
  static DOCUMENTATION = 'claims parameter should be a JSON object';
  static ERROR_SOURCE = 'actions/authorization/check_claims.js:38';
  static UI = 'OidcProvider.exceptions.InvalidRequest.AFAC';
}
