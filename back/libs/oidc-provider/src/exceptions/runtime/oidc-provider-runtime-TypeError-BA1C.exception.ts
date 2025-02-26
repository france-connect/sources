/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_BA1C_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'BA1C';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL = '"claims" must be an array';
  static DOCUMENTATION = '"claims" must be an array';
  static ERROR_SOURCE = 'models/grant.js:215';
  static UI = 'OidcProvider.exceptions.TypeError.BA1C';
}
