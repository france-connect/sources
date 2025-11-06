/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_errors_InvalidRequest_5A94D_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '5A94D';
  static ERROR_CLASS = 'errors_InvalidRequest';
  static ERROR_DETAIL = 'invalid claims.id_token.acr.values type';
  static DOCUMENTATION = 'invalid claims.id_token.acr.values type';
  static ERROR_SOURCE = 'helpers/interaction_policy/prompts/login.js:131';
  static UI = 'OidcProvider.exceptions.errors_InvalidRequest.5A94D';
}
