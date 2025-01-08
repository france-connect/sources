/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_27BC_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '27BC';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL = 'missing jwt.sign.key Resource Server configuration';
  static DOCUMENTATION = 'missing jwt.sign.key Resource Server configuration';
  static ERROR_SOURCE = 'models/formats/jwt.js:38';
  static UI = 'OidcProvider.exceptions.Error.27BC';
}
