/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidDpopProof_9A235_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '9A235';
  static ERROR_CLASS = 'InvalidDpopProof';
  static ERROR_DETAIL = 'DPoP proof ath mismatch';
  static DOCUMENTATION = 'DPoP proof ath mismatch';
  static ERROR_SOURCE = 'helpers/validate_dpop.js:97';
  static UI = 'OidcProvider.exceptions.InvalidDpopProof.9A235';
}
