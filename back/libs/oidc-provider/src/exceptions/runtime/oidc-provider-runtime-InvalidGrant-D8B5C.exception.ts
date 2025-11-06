/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_D8B5C_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'D8B5C';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'grant not found';
  static DOCUMENTATION = 'grant not found';
  static ERROR_SOURCE = 'actions/grants/authorization_code.js:62';
  static UI = 'OidcProvider.exceptions.InvalidGrant.D8B5C';
}
