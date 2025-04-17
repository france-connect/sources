/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_B28F_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'B28F';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'DPoP proof key thumbprint does not match dpop_jkt';
  static DOCUMENTATION = 'DPoP proof key thumbprint does not match dpop_jkt';
  static ERROR_SOURCE = 'actions/authorization/check_dpop_jkt.js:28';
  static UI = 'OidcProvider.exceptions.InvalidRequest.B28F';
}
