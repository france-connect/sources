/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_65CE_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '65CE';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'client mismatch';
  static DOCUMENTATION = 'client mismatch';
  static ERROR_SOURCE = 'actions/grants/refresh_token.js:43';
  static UI = 'OidcProvider.exceptions.InvalidGrant.65CE';
}
