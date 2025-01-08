/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_E23D_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'E23D';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'code_challenge must be provided with code_challenge_method';
  static DOCUMENTATION =
    'code_challenge must be provided with code_challenge_method';
  static ERROR_SOURCE = 'actions/authorization/check_pkce.js:28';
  static UI = 'OidcProvider.exceptions.InvalidRequest.E23D';
}
