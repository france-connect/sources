/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidDpopProof_743BC_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '743BC';
  static ERROR_CLASS = 'InvalidDpopProof';
  static ERROR_DETAIL = 'DPoP proof nonce must be a string';
  static DOCUMENTATION = 'DPoP proof nonce must be a string';
  static ERROR_SOURCE = 'helpers/validate_dpop.js:61';
  static UI = 'OidcProvider.exceptions.InvalidDpopProof.743BC';
}
