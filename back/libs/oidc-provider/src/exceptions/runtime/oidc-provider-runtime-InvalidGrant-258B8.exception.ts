/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_258B8_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '258B8';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL =
    'backchannel authentication request invalid (referenced account not found)';
  static DOCUMENTATION =
    'backchannel authentication request invalid (referenced account not found)';
  static ERROR_SOURCE = 'actions/grants/ciba.js:111';
  static UI = 'OidcProvider.exceptions.InvalidGrant.258B8';
}
