/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_A769_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'A769';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL = '"claims" must be an array of strings';
  static DOCUMENTATION = '"claims" must be an array of strings';
  static ERROR_SOURCE = 'models/grant.js:218';
  static UI = 'OidcProvider.exceptions.TypeError.A769';
}
