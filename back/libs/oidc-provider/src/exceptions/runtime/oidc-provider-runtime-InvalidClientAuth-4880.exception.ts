/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientAuth_4880_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '4880';
  static ERROR_CLASS = 'InvalidClientAuth';
  static ERROR_DETAIL =
    'sub (JWT subject) must be provided in the client_assertion JWT';
  static DOCUMENTATION =
    'sub (JWT subject) must be provided in the client_assertion JWT';
  static ERROR_SOURCE = 'shared/token_auth.js:127';
  static UI = 'OidcProvider.exceptions.InvalidClientAuth.4880';
}
