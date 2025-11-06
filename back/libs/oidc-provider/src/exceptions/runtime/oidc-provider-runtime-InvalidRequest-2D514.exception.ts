/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_2D514_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '2D514';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'code_challenge must be provided with code_challenge_method';
  static DOCUMENTATION =
    'code_challenge must be provided with code_challenge_method';
  static ERROR_SOURCE = 'actions/authorization/check_pkce.js:24';
  static UI = 'OidcProvider.exceptions.InvalidRequest.2D514';
}
