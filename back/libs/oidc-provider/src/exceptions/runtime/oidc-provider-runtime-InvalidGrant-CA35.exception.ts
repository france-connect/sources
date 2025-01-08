/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_CA35_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'CA35';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'backchannel authentication request already consumed';
  static DOCUMENTATION = 'backchannel authentication request already consumed';
  static ERROR_SOURCE = 'actions/grants/ciba.js:64';
  static UI = 'OidcProvider.exceptions.InvalidGrant.CA35';
}
