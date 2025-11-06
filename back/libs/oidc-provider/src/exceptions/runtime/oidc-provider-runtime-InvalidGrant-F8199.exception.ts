/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_F8199_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'F8199';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'authorization code redirect_uri mismatch';
  static DOCUMENTATION = 'authorization code redirect_uri mismatch';
  static ERROR_SOURCE = 'actions/grants/authorization_code.js:88';
  static UI = 'OidcProvider.exceptions.InvalidGrant.F8199';
}
