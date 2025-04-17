/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_579C_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '579C';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'DPoP proof key thumbprint does not match dpop_jkt';
  static DOCUMENTATION = 'DPoP proof key thumbprint does not match dpop_jkt';
  static ERROR_SOURCE = 'actions/grants/authorization_code.js:146';
  static UI = 'OidcProvider.exceptions.InvalidGrant.579C';
}
