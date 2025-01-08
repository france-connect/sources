/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_40D3_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '40D3';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'refresh token already used';
  static DOCUMENTATION = 'refresh token already used';
  static ERROR_SOURCE = 'actions/grants/refresh_token.js:120';
  static UI = 'OidcProvider.exceptions.InvalidGrant.40D3';
}
