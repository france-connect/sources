/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidDpopProof_743B_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '743B';
  static ERROR_CLASS = 'InvalidDpopProof';
  static ERROR_DETAIL = 'DPoP Proof ath mismatch';
  static DOCUMENTATION = 'DPoP Proof ath mismatch';
  static ERROR_SOURCE = 'helpers/validate_dpop.js:61';
  static UI = 'OidcProvider.exceptions.InvalidDpopProof.743B';
}
