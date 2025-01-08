/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_E054_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'E054';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'plain code_challenge_method fallback disabled, code_challenge_method must be provided';
  static DOCUMENTATION =
    'plain code_challenge_method fallback disabled, code_challenge_method must be provided';
  static ERROR_SOURCE = 'actions/authorization/check_pkce.js:18';
  static UI = 'OidcProvider.exceptions.InvalidRequest.E054';
}
