/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_90FD_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '90FD';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL = 'invalid JWT.decode input type';
  static DOCUMENTATION = 'invalid JWT.decode input type';
  static ERROR_SOURCE = 'helpers/jwt.js:63';
  static UI = 'OidcProvider.exceptions.TypeError.90FD';
}
