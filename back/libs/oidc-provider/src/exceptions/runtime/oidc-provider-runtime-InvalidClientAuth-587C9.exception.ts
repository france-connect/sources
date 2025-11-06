/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientAuth_587C9_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '587C9';
  static ERROR_CLASS = 'InvalidClientAuth';
  static ERROR_DETAIL =
    'certificate subject value does not match the registered one';
  static DOCUMENTATION =
    'certificate subject value does not match the registered one';
  static ERROR_SOURCE = 'shared/client_auth.js:237';
  static UI = 'OidcProvider.exceptions.InvalidClientAuth.587C9';
}
