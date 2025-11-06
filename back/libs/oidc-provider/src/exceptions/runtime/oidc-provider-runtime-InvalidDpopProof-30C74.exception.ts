/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidDpopProof_30C74_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '30C74';
  static ERROR_CLASS = 'InvalidDpopProof';
  static ERROR_DETAIL = 'DPoP nonces are not supported';
  static DOCUMENTATION = 'DPoP nonces are not supported';
  static ERROR_SOURCE = 'helpers/validate_dpop.js:75';
  static UI = 'OidcProvider.exceptions.InvalidDpopProof.30C74';
}
