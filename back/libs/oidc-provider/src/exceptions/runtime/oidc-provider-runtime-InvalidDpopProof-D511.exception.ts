/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidDpopProof_D511_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'D511';
  static ERROR_CLASS = 'InvalidDpopProof';
  static ERROR_DETAIL = 'DPoP proof iat is not recent enough';
  static DOCUMENTATION = 'DPoP proof iat is not recent enough';
  static ERROR_SOURCE = 'helpers/validate_dpop.js:73';
  static UI = 'OidcProvider.exceptions.InvalidDpopProof.D511';
}
