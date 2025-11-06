/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidDpopProof_D6A0A_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'D6A0A';
  static ERROR_CLASS = 'InvalidDpopProof';
  static ERROR_DETAIL = 'DPoP proof must have a iat number property';
  static DOCUMENTATION = 'DPoP proof must have a iat number property';
  static ERROR_SOURCE = 'helpers/validate_dpop.js:53';
  static UI = 'OidcProvider.exceptions.InvalidDpopProof.D6A0A';
}
