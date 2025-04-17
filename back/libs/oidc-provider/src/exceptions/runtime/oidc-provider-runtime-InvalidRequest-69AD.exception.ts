/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_69AD_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '69AD';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'code_challenge must be provided with code_challenge_method';
  static DOCUMENTATION =
    'code_challenge must be provided with code_challenge_method';
  static ERROR_SOURCE = 'actions/authorization/check_pkce.js:30';
  static UI = 'OidcProvider.exceptions.InvalidRequest.69AD';
}
