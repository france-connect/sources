/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_F9C1_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'F9C1';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'accountId mismatch';
  static DOCUMENTATION = 'accountId mismatch';
  static ERROR_SOURCE = 'actions/grants/authorization_code.js:98';
  static UI = 'OidcProvider.exceptions.InvalidGrant.F9C1';
}
