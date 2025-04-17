/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidDpopProof_C5CC_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'C5CC';
  static ERROR_CLASS = 'InvalidDpopProof';
  static ERROR_DETAIL = 'DPoP proof ath mismatch';
  static DOCUMENTATION = 'DPoP proof ath mismatch';
  static ERROR_SOURCE = 'helpers/validate_dpop.js:100';
  static UI = 'OidcProvider.exceptions.InvalidDpopProof.C5CC';
}
