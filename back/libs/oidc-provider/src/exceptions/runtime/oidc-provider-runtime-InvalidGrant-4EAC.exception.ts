/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_4EAC_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '4EAC';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'failed x5t#S256 verification';
  static DOCUMENTATION = 'failed x5t#S256 verification';
  static ERROR_SOURCE = 'actions/grants/refresh_token.js:59';
  static UI = 'OidcProvider.exceptions.InvalidGrant.4EAC';
}
