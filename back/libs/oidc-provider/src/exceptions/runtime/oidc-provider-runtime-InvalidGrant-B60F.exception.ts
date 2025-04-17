/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_B60F_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'B60F';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'refresh token not found';
  static DOCUMENTATION = 'refresh token not found';
  static ERROR_SOURCE = 'actions/grants/refresh_token.js:52';
  static UI = 'OidcProvider.exceptions.InvalidGrant.B60F';
}
