/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_6C691_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '6C691';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'grant not found';
  static DOCUMENTATION = 'grant not found';
  static ERROR_SOURCE = 'actions/grants/refresh_token.js:83';
  static UI = 'OidcProvider.exceptions.InvalidGrant.6C691';
}
