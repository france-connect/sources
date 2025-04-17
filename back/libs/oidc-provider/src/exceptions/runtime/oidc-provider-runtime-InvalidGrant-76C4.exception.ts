/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_76C4_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '76C4';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'refresh token already used';
  static DOCUMENTATION = 'refresh token already used';
  static ERROR_SOURCE = 'actions/grants/refresh_token.js:137';
  static UI = 'OidcProvider.exceptions.InvalidGrant.76C4';
}
