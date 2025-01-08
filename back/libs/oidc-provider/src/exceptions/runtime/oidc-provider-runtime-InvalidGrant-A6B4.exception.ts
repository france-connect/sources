/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_A6B4_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'A6B4';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'refresh token invalid (referenced account not found)';
  static DOCUMENTATION = 'refresh token invalid (referenced account not found)';
  static ERROR_SOURCE = 'actions/grants/refresh_token.js:106';
  static UI = 'OidcProvider.exceptions.InvalidGrant.A6B4';
}
