/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_UseDpopNonce_9D9D1_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '9D9D1';
  static ERROR_CLASS = 'UseDpopNonce';
  static ERROR_DETAIL = 'nonce is required in the DPoP proof';
  static DOCUMENTATION = 'nonce is required in the DPoP proof';
  static ERROR_SOURCE = 'helpers/validate_dpop.js:109';
  static UI = 'OidcProvider.exceptions.UseDpopNonce.9D9D1';
}
