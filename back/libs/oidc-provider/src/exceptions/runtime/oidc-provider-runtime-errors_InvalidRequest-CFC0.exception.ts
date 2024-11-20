/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_errors_InvalidRequest_CFC0_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'CFC0';
  static ERROR_CLASS = 'errors_InvalidRequest';
  static ERROR_DETAIL = 'invalid claims.id_token.acr.values type';
  static DOCUMENTATION = 'invalid claims.id_token.acr.values type';
  static ERROR_SOURCE = 'helpers/interaction_policy/prompts/login.js:104';
  static UI = 'OidcProvider.exceptions.errors_InvalidRequest.CFC0';
}
