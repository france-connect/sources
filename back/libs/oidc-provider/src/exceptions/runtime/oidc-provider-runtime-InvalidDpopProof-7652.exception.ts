/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidDpopProof_7652_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '7652';
  static ERROR_CLASS = 'InvalidDpopProof';
  static ERROR_DETAIL = 'DPoP Proof htm mismatch';
  static DOCUMENTATION = 'DPoP Proof htm mismatch';
  static ERROR_SOURCE = 'helpers/validate_dpop.js:51';
  static UI = 'OidcProvider.exceptions.InvalidDpopProof.7652';
}
