/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_B310_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'B310';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'grant is expired';
  static DOCUMENTATION = 'grant is expired';
  static ERROR_SOURCE = 'actions/grants/ciba.js:97';
  static UI = 'OidcProvider.exceptions.InvalidGrant.B310';
}
