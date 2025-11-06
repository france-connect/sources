/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_BB6F3_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'BB6F3';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'backchannel authentication request not found';
  static DOCUMENTATION = 'backchannel authentication request not found';
  static ERROR_SOURCE = 'actions/grants/ciba.js:47';
  static UI = 'OidcProvider.exceptions.InvalidGrant.BB6F3';
}
