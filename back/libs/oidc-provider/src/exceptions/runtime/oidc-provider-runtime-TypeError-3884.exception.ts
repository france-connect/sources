/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_3884_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '3884';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL = 'pkce.methods must not be empty';
  static DOCUMENTATION = 'pkce.methods must not be empty';
  static ERROR_SOURCE = 'helpers/configuration.js:372';
  static UI = 'OidcProvider.exceptions.TypeError.3884';
}
