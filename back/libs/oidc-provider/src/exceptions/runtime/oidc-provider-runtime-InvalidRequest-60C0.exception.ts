/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_60C0_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '60C0';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'could not parse the claims parameter JSON';
  static DOCUMENTATION = 'could not parse the claims parameter JSON';
  static ERROR_SOURCE = 'actions/authorization/check_claims.js:34';
  static UI = 'OidcProvider.exceptions.InvalidRequest.60C0';
}
