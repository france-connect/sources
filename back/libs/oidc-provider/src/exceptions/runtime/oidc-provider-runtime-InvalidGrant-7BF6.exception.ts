/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_7BF6_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '7BF6';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'authorization code not found';
  static DOCUMENTATION = 'authorization code not found';
  static ERROR_SOURCE = 'actions/grants/authorization_code.js:40';
  static UI = 'OidcProvider.exceptions.InvalidGrant.7BF6';
}
