/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_F09A_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'F09A';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'failed x5t#S256 verification';
  static DOCUMENTATION = 'failed x5t#S256 verification';
  static ERROR_SOURCE = 'actions/grants/refresh_token.js:76';
  static UI = 'OidcProvider.exceptions.InvalidGrant.F09A';
}
