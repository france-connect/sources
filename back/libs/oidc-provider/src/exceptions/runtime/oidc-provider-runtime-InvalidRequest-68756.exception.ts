/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_68756_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '68756';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'not supported value of code_challenge_method';
  static DOCUMENTATION = 'not supported value of code_challenge_method';
  static ERROR_SOURCE = 'actions/authorization/check_pkce.js:20';
  static UI = 'OidcProvider.exceptions.InvalidRequest.68756';
}
