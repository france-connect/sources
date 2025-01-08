/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidDpopProof_925C_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '925C';
  static ERROR_CLASS = 'InvalidDpopProof';
  static ERROR_DETAIL = 'DPoP Proof must have a jti string property';
  static DOCUMENTATION = 'DPoP Proof must have a jti string property';
  static ERROR_SOURCE = 'helpers/validate_dpop.js:47';
  static UI = 'OidcProvider.exceptions.InvalidDpopProof.925C';
}
