/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_6976_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '6976';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'backchannel authentication request not found';
  static DOCUMENTATION = 'backchannel authentication request not found';
  static ERROR_SOURCE = 'actions/grants/ciba.js:46';
  static UI = 'OidcProvider.exceptions.InvalidGrant.6976';
}
