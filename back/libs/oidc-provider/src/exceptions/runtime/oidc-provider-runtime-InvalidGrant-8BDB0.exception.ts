/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_8BDB0_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '8BDB0';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'client mismatch';
  static DOCUMENTATION = 'client mismatch';
  static ERROR_SOURCE = 'actions/grants/device_code.js:101';
  static UI = 'OidcProvider.exceptions.InvalidGrant.8BDB0';
}
