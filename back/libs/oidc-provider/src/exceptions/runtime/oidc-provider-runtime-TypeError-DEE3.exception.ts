/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_DEE3_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'DEE3';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL = 'pkce.methods must be an array';
  static DOCUMENTATION = 'pkce.methods must be an array';
  static ERROR_SOURCE = 'helpers/configuration.js:354';
  static UI = 'OidcProvider.exceptions.TypeError.DEE3';
}
