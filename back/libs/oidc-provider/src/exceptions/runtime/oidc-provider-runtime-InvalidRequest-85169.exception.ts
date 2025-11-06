/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_85169_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '85169';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'could not parse the claims parameter JSON';
  static DOCUMENTATION = 'could not parse the claims parameter JSON';
  static ERROR_SOURCE = 'actions/authorization/check_claims.js:32';
  static UI = 'OidcProvider.exceptions.InvalidRequest.85169';
}
