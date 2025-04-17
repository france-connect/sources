/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_E0B7_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'E0B7';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL = 'features.dPoP.nonceSecret configuration is missing';
  static DOCUMENTATION = 'features.dPoP.nonceSecret configuration is missing';
  static ERROR_SOURCE = 'helpers/validate_dpop.js:44';
  static UI = 'OidcProvider.exceptions.Error.E0B7';
}
