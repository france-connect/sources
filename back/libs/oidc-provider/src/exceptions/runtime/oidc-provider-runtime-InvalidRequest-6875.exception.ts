/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_6875_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '6875';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'plain code_challenge_method fallback disabled, code_challenge_method must be provided';
  static DOCUMENTATION =
    'plain code_challenge_method fallback disabled, code_challenge_method must be provided';
  static ERROR_SOURCE = 'actions/authorization/check_pkce.js:20';
  static UI = 'OidcProvider.exceptions.InvalidRequest.6875';
}
