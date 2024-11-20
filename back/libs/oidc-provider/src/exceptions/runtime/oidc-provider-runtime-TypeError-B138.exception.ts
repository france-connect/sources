/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_B138_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'B138';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL = 'unsupported response type: ${type}';
  static DOCUMENTATION = 'unsupported response type: ${type}';
  static ERROR_SOURCE = 'helpers/configuration.js:145';
  static UI = 'OidcProvider.exceptions.TypeError.B138';
}
