/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_AA5E_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'AA5E';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'grant not found';
  static DOCUMENTATION = 'grant not found';
  static ERROR_SOURCE = 'actions/grants/authorization_code.js:61';
  static UI = 'OidcProvider.exceptions.InvalidGrant.AA5E';
}
