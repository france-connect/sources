/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_3238_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '3238';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'refresh token invalid (referenced account not found)';
  static DOCUMENTATION = 'refresh token invalid (referenced account not found)';
  static ERROR_SOURCE = 'actions/grants/refresh_token.js:123';
  static UI = 'OidcProvider.exceptions.InvalidGrant.3238';
}
