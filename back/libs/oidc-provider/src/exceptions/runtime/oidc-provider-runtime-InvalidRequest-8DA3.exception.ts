/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_8DA3_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '8DA3';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'not supported value of code_challenge_method';
  static DOCUMENTATION = 'not supported value of code_challenge_method';
  static ERROR_SOURCE = 'actions/authorization/check_pkce.js:26';
  static UI = 'OidcProvider.exceptions.InvalidRequest.8DA3';
}
