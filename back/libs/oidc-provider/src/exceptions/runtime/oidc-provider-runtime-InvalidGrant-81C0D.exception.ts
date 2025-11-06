/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_81C0D_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '81C0D';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'client mismatch';
  static DOCUMENTATION = 'client mismatch';
  static ERROR_SOURCE = 'actions/grants/refresh_token.js:55';
  static UI = 'OidcProvider.exceptions.InvalidGrant.81C0D';
}
