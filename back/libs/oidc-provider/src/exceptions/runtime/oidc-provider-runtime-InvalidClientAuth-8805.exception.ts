/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientAuth_8805_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '8805';
  static ERROR_CLASS = 'InvalidClientAuth';
  static ERROR_DETAIL = 'client certificate was not verified';
  static DOCUMENTATION = 'client certificate was not verified';
  static ERROR_SOURCE = 'shared/token_auth.js:225';
  static UI = 'OidcProvider.exceptions.InvalidClientAuth.8805';
}
