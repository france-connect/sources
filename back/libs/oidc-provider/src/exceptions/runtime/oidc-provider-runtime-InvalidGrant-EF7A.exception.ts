/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_EF7A_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'EF7A';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'grant is expired';
  static DOCUMENTATION = 'grant is expired';
  static ERROR_SOURCE = 'actions/grants/authorization_code.js:65';
  static UI = 'OidcProvider.exceptions.InvalidGrant.EF7A';
}
