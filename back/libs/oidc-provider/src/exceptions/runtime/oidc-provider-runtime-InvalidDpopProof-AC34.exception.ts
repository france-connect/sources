/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidDpopProof_AC34_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'AC34';
  static ERROR_CLASS = 'InvalidDpopProof';
  static ERROR_DETAIL = 'DPoP proof htm mismatch';
  static DOCUMENTATION = 'DPoP proof htm mismatch';
  static ERROR_SOURCE = 'helpers/validate_dpop.js:80';
  static UI = 'OidcProvider.exceptions.InvalidDpopProof.AC34';
}
