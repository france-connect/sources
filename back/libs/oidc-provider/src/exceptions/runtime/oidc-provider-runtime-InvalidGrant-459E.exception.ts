/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_459E_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '459E';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'authorization code redirect_uri mismatch';
  static DOCUMENTATION = 'authorization code redirect_uri mismatch';
  static ERROR_SOURCE = 'actions/grants/authorization_code.js:87';
  static UI = 'OidcProvider.exceptions.InvalidGrant.459E';
}
