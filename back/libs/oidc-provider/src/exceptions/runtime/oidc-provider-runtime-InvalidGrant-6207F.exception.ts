/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_6207F_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '6207F';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'device code already consumed';
  static DOCUMENTATION = 'device code already consumed';
  static ERROR_SOURCE = 'actions/grants/device_code.js:75';
  static UI = 'OidcProvider.exceptions.InvalidGrant.6207F';
}
