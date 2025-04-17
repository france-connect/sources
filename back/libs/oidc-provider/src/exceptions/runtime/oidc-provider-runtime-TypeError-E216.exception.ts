/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_E216_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'E216';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL = 'invalid JWT.decode input type';
  static DOCUMENTATION = 'invalid JWT.decode input type';
  static ERROR_SOURCE = 'helpers/jwt.js:60';
  static UI = 'OidcProvider.exceptions.TypeError.E216';
}
