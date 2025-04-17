/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientAuth_C82A_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'C82A';
  static ERROR_CLASS = 'InvalidClientAuth';
  static ERROR_DETAIL = 'client certificate was not provided';
  static DOCUMENTATION = 'client certificate was not provided';
  static ERROR_SOURCE = 'shared/token_auth.js:251';
  static UI = 'OidcProvider.exceptions.InvalidClientAuth.C82A';
}
