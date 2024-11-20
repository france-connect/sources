/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_D1FA_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'D1FA';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'backchannel authentication request not found';
  static DOCUMENTATION = 'backchannel authentication request not found';
  static ERROR_SOURCE = 'actions/grants/ciba.js:39';
  static UI = 'OidcProvider.exceptions.InvalidGrant.D1FA';
}
