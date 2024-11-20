/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_7564_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '7564';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'device code invalid (referenced account not found)';
  static DOCUMENTATION = 'device code invalid (referenced account not found)';
  static ERROR_SOURCE = 'actions/grants/device_code.js:98';
  static UI = 'OidcProvider.exceptions.InvalidGrant.7564';
}
