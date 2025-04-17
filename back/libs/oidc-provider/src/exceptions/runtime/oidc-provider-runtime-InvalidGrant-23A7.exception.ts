/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_23A7_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '23A7';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'client mismatch';
  static DOCUMENTATION = 'client mismatch';
  static ERROR_SOURCE = 'actions/grants/authorization_code.js:49';
  static UI = 'OidcProvider.exceptions.InvalidGrant.23A7';
}
