/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_3051A_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '3051A';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'failed jkt verification';
  static DOCUMENTATION = 'failed jkt verification';
  static ERROR_SOURCE = 'actions/grants/refresh_token.js:113';
  static UI = 'OidcProvider.exceptions.InvalidGrant.3051A';
}
