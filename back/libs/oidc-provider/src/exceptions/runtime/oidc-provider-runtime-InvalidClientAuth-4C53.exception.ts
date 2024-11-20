/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientAuth_4C53_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '4C53';
  static ERROR_CLASS = 'InvalidClientAuth';
  static ERROR_DETAIL = 'client not found';
  static DOCUMENTATION = 'client not found';
  static ERROR_SOURCE = 'shared/token_auth.js:147';
  static UI = 'OidcProvider.exceptions.InvalidClientAuth.4C53';
}
