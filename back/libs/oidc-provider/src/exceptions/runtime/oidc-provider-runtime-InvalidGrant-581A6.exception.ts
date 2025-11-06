/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_581A6_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '581A6';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'device code invalid (referenced account not found)';
  static DOCUMENTATION = 'device code invalid (referenced account not found)';
  static ERROR_SOURCE = 'actions/grants/device_code.js:110';
  static UI = 'OidcProvider.exceptions.InvalidGrant.581A6';
}
