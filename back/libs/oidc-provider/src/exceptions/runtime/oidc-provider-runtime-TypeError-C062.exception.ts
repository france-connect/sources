/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_C062_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'C062';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL = 'unsupported response type: ${type}';
  static DOCUMENTATION = 'unsupported response type: ${type}';
  static ERROR_SOURCE = 'helpers/configuration.js:166';
  static UI = 'OidcProvider.exceptions.TypeError.C062';
}
