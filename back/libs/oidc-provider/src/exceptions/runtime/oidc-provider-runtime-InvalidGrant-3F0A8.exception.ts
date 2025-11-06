/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_3F0A8_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '3F0A8';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'authorization code is expired';
  static DOCUMENTATION = 'authorization code is expired';
  static ERROR_SOURCE = 'actions/grants/authorization_code.js:54';
  static UI = 'OidcProvider.exceptions.InvalidGrant.3F0A8';
}
