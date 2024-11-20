/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_20EA_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '20EA';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'refresh token is expired';
  static DOCUMENTATION = 'refresh token is expired';
  static ERROR_SOURCE = 'actions/grants/refresh_token.js:47';
  static UI = 'OidcProvider.exceptions.InvalidGrant.20EA';
}
