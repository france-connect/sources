/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_87E5_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '87E5';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL = 'provider key (kid: ${jwk.kid}) is invalid';
  static DOCUMENTATION = 'provider key (kid: ${jwk.kid}) is invalid';
  static ERROR_SOURCE = 'models/id_token.js:158';
  static UI = 'OidcProvider.exceptions.Error.87E5';
}
