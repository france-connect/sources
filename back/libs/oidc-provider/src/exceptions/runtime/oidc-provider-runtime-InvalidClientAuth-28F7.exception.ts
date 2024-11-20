/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientAuth_28F7_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '28F7';
  static ERROR_CLASS = 'InvalidClientAuth';
  static ERROR_DETAIL =
    'certificate subject value does not match the registered one';
  static DOCUMENTATION =
    'certificate subject value does not match the registered one';
  static ERROR_SOURCE = 'shared/token_auth.js:227';
  static UI = 'OidcProvider.exceptions.InvalidClientAuth.28F7';
}
