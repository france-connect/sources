/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_2CED_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '2CED';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'grant not found';
  static DOCUMENTATION = 'grant not found';
  static ERROR_SOURCE = 'actions/grants/device_code.js:81';
  static UI = 'OidcProvider.exceptions.InvalidGrant.2CED';
}
