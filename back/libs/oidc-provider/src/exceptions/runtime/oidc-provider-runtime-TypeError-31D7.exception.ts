/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_31D7_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '31D7';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL = 'invalid JWT.decode input';
  static DOCUMENTATION = 'invalid JWT.decode input';
  static ERROR_SOURCE = 'helpers/jwt.js:71';
  static UI = 'OidcProvider.exceptions.TypeError.31D7';
}
