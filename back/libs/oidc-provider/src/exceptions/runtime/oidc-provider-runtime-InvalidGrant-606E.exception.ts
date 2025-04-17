/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_606E_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '606E';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'device code not found';
  static DOCUMENTATION = 'device code not found';
  static ERROR_SOURCE = 'actions/grants/device_code.js:45';
  static UI = 'OidcProvider.exceptions.InvalidGrant.606E';
}
