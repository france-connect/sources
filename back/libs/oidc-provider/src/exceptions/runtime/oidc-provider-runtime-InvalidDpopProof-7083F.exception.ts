/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidDpopProof_7083F_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '7083F';
  static ERROR_CLASS = 'InvalidDpopProof';
  static ERROR_DETAIL = 'DPoP proof iat is not recent enough';
  static DOCUMENTATION = 'DPoP proof iat is not recent enough';
  static ERROR_SOURCE = 'helpers/validate_dpop.js:72';
  static UI = 'OidcProvider.exceptions.InvalidDpopProof.7083F';
}
