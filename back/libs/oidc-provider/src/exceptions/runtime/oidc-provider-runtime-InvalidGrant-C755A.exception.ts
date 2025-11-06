/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_C755A_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'C755A';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'DPoP proof JWT not provided';
  static DOCUMENTATION = 'DPoP proof JWT not provided';
  static ERROR_SOURCE = 'actions/grants/refresh_token.js:71';
  static UI = 'OidcProvider.exceptions.InvalidGrant.C755A';
}
