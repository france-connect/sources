/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidDpopProof_ADEC2_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'ADEC2';
  static ERROR_CLASS = 'InvalidDpopProof';
  static ERROR_DETAIL = 'DPoP proof htu mismatch';
  static DOCUMENTATION = 'DPoP proof htu mismatch';
  static ERROR_SOURCE = 'helpers/validate_dpop.js:90';
  static UI = 'OidcProvider.exceptions.InvalidDpopProof.ADEC2';
}
