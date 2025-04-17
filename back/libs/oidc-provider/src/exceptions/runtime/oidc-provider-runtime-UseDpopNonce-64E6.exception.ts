/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_UseDpopNonce_64E6_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '64E6';
  static ERROR_CLASS = 'UseDpopNonce';
  static ERROR_DETAIL = 'nonce is required in the DPoP proof';
  static DOCUMENTATION = 'nonce is required in the DPoP proof';
  static ERROR_SOURCE = 'helpers/validate_dpop.js:112';
  static UI = 'OidcProvider.exceptions.UseDpopNonce.64E6';
}
