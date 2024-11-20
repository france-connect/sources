/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_4A7F_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '4A7F';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'refresh token not found';
  static DOCUMENTATION = 'refresh token not found';
  static ERROR_SOURCE = 'actions/grants/refresh_token.js:39';
  static UI = 'OidcProvider.exceptions.InvalidGrant.4A7F';
}
