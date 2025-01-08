/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_8609_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '8609';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'device code already consumed';
  static DOCUMENTATION = 'device code already consumed';
  static ERROR_SOURCE = 'actions/grants/device_code.js:63';
  static UI = 'OidcProvider.exceptions.InvalidGrant.8609';
}
