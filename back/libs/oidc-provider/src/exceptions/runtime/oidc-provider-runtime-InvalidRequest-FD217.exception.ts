/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_FD217_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'FD217';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'code_challenge_method must be provided';
  static DOCUMENTATION = 'code_challenge_method must be provided';
  static ERROR_SOURCE = 'actions/authorization/check_pkce.js:15';
  static UI = 'OidcProvider.exceptions.InvalidRequest.FD217';
}
