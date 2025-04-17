/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_73AD_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '73AD';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL = 'scope cannot be assigned after mask has been set';
  static DOCUMENTATION = 'scope cannot be assigned after mask has been set';
  static ERROR_SOURCE = 'helpers/claims.js:27';
  static UI = 'OidcProvider.exceptions.Error.73AD';
}
