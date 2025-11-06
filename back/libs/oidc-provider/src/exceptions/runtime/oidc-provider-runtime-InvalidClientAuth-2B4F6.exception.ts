/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientAuth_2B4F6_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '2B4F6';
  static ERROR_CLASS = 'InvalidClientAuth';
  static ERROR_DETAIL = 'client certificate was not verified';
  static DOCUMENTATION = 'client certificate was not verified';
  static ERROR_SOURCE = 'shared/client_auth.js:224';
  static UI = 'OidcProvider.exceptions.InvalidClientAuth.2B4F6';
}
