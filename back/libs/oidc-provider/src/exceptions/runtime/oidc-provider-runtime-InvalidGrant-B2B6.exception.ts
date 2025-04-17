/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_B2B6_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'B2B6';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'accountId mismatch';
  static DOCUMENTATION = 'accountId mismatch';
  static ERROR_SOURCE = 'actions/grants/ciba.js:114';
  static UI = 'OidcProvider.exceptions.InvalidGrant.B2B6';
}
