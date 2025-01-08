/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidDpopProof_3376_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '3376';
  static ERROR_CLASS = 'InvalidDpopProof';
  static ERROR_DETAIL = 'DPoP Proof htu mismatch';
  static DOCUMENTATION = 'DPoP Proof htu mismatch';
  static ERROR_SOURCE = 'helpers/validate_dpop.js:55';
  static UI = 'OidcProvider.exceptions.InvalidDpopProof.3376';
}
