/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_685E_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '685E';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL = 'invalid JWT.decode input';
  static DOCUMENTATION = 'invalid JWT.decode input';
  static ERROR_SOURCE = 'helpers/jwt.js:68';
  static UI = 'OidcProvider.exceptions.TypeError.685E';
}
