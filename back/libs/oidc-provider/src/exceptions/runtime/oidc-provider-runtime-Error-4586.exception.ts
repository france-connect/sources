/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_4586_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '4586';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL = 'jwt missing azp claim';
  static DOCUMENTATION = 'jwt missing azp claim';
  static ERROR_SOURCE = 'helpers/jwt.js:22';
  static UI = 'OidcProvider.exceptions.Error.4586';
}
