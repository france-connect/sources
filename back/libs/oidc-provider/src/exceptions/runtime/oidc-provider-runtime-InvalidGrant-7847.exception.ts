/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_7847_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '7847';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'grant is expired';
  static DOCUMENTATION = 'grant is expired';
  static ERROR_SOURCE = 'actions/grants/authorization_code.js:60';
  static UI = 'OidcProvider.exceptions.InvalidGrant.7847';
}
