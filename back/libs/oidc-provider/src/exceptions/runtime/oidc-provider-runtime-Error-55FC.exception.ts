/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_55FC_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '55FC';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL = 'provider key (kid: ${jwk.kid}) is invalid';
  static DOCUMENTATION = 'provider key (kid: ${jwk.kid}) is invalid';
  static ERROR_SOURCE = 'models/id_token.js:159';
  static UI = 'OidcProvider.exceptions.Error.55FC';
}
