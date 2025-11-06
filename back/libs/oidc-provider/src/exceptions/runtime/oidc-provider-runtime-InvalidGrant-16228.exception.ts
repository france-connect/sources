/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_16228_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '16228';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'authorization code already consumed';
  static DOCUMENTATION = 'authorization code already consumed';
  static ERROR_SOURCE = 'actions/grants/authorization_code.js:93';
  static UI = 'OidcProvider.exceptions.InvalidGrant.16228';
}
