/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_13FB_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '13FB';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL = 'accountId mismatch';
  static DOCUMENTATION = 'accountId mismatch';
  static ERROR_SOURCE = 'actions/authorization/load_grant.js:12';
  static UI = 'OidcProvider.exceptions.Error.13FB';
}
