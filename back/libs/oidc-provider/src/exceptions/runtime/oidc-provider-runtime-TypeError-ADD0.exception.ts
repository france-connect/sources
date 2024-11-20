/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_ADD0_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'ADD0';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL = 'only poll and ping CIBA delivery modes are supported';
  static DOCUMENTATION = 'only poll and ping CIBA delivery modes are supported';
  static ERROR_SOURCE = 'helpers/configuration.js:347';
  static UI = 'OidcProvider.exceptions.TypeError.ADD0';
}
