/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_F00CD_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'F00CD';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL =
    'authorization code invalid (referenced account not found)';
  static DOCUMENTATION =
    'authorization code invalid (referenced account not found)';
  static ERROR_SOURCE = 'actions/grants/authorization_code.js:104';
  static UI = 'OidcProvider.exceptions.InvalidGrant.F00CD';
}
