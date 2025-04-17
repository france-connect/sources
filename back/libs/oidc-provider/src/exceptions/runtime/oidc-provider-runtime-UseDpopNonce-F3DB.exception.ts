/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_UseDpopNonce_F3DB_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'F3DB';
  static ERROR_CLASS = 'UseDpopNonce';
  static ERROR_DETAIL = 'invalid nonce in DPoP proof';
  static DOCUMENTATION = 'invalid nonce in DPoP proof';
  static ERROR_SOURCE = 'helpers/validate_dpop.js:117';
  static UI = 'OidcProvider.exceptions.UseDpopNonce.F3DB';
}
