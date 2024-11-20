/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_DC8E_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'DC8E';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL =
    'backchannel authentication request invalid (referenced account not found)';
  static DOCUMENTATION =
    'backchannel authentication request invalid (referenced account not found)';
  static ERROR_SOURCE = 'actions/grants/ciba.js:99';
  static UI = 'OidcProvider.exceptions.InvalidGrant.DC8E';
}
