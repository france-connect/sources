/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidDpopProof_E16F_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'E16F';
  static ERROR_CLASS = 'InvalidDpopProof';
  static ERROR_DETAIL = 'DPoP proof must have a iat number property';
  static DOCUMENTATION = 'DPoP proof must have a iat number property';
  static ERROR_SOURCE = 'helpers/validate_dpop.js:54';
  static UI = 'OidcProvider.exceptions.InvalidDpopProof.E16F';
}
