/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_A5935_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'A5935';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL = 'features.dPoP.requireNonce must return a boolean';
  static DOCUMENTATION = 'features.dPoP.requireNonce must return a boolean';
  static ERROR_SOURCE = 'helpers/validate_dpop.js:40';
  static UI = 'OidcProvider.exceptions.Error.A5935';
}
