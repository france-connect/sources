/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_UseDpopNonce_75E3_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '75E3';
  static ERROR_CLASS = 'UseDpopNonce';
  static ERROR_DETAIL =
    'DPoP proof iat is not recent enough, use a DPoP nonce instead';
  static DOCUMENTATION =
    'DPoP proof iat is not recent enough, use a DPoP nonce instead';
  static ERROR_SOURCE = 'helpers/validate_dpop.js:71';
  static UI = 'OidcProvider.exceptions.UseDpopNonce.75E3';
}
