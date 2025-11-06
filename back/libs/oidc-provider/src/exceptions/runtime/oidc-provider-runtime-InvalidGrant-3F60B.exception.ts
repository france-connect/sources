/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_3F60B_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '3F60B';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'accountId mismatch';
  static DOCUMENTATION = 'accountId mismatch';
  static ERROR_SOURCE = 'actions/grants/authorization_code.js:108';
  static UI = 'OidcProvider.exceptions.InvalidGrant.3F60B';
}
