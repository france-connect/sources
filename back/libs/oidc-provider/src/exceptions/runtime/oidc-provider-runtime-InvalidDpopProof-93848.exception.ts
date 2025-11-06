/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidDpopProof_93848_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '93848';
  static ERROR_CLASS = 'InvalidDpopProof';
  static ERROR_DETAIL = 'DPoP proof must have a jti string property';
  static DOCUMENTATION = 'DPoP proof must have a jti string property';
  static ERROR_SOURCE = 'helpers/validate_dpop.js:57';
  static UI = 'OidcProvider.exceptions.InvalidDpopProof.93848';
}
