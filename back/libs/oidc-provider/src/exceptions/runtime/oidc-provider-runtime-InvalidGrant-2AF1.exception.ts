/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_2AF1_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '2AF1';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'accountId mismatch';
  static DOCUMENTATION = 'accountId mismatch';
  static ERROR_SOURCE = 'actions/grants/device_code.js:113';
  static UI = 'OidcProvider.exceptions.InvalidGrant.2AF1';
}
