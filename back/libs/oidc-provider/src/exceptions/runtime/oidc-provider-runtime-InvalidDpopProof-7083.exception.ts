/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidDpopProof_7083_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '7083';
  static ERROR_CLASS = 'InvalidDpopProof';
  static ERROR_DETAIL = 'invalid DPoP key binding, err.message';
  static DOCUMENTATION = 'invalid DPoP key binding, err.message';
  static ERROR_SOURCE = 'helpers/validate_dpop.js:72';
  static UI = 'OidcProvider.exceptions.InvalidDpopProof.7083';
}
