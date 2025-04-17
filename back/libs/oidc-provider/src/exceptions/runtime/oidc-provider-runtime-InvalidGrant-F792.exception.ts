/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_F792_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'F792';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL =
    'backchannel authentication request invalid (referenced account not found)';
  static DOCUMENTATION =
    'backchannel authentication request invalid (referenced account not found)';
  static ERROR_SOURCE = 'actions/grants/ciba.js:110';
  static UI = 'OidcProvider.exceptions.InvalidGrant.F792';
}
