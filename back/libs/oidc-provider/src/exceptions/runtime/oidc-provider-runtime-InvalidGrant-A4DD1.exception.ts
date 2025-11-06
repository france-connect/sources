/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_A4DD1_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'A4DD1';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'refresh token already used';
  static DOCUMENTATION = 'refresh token already used';
  static ERROR_SOURCE = 'actions/grants/refresh_token.js:136';
  static UI = 'OidcProvider.exceptions.InvalidGrant.A4DD1';
}
