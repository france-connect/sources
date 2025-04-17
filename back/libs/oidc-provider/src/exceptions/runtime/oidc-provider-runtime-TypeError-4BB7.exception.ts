/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_4BB7_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '4BB7';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL = 'only poll and ping CIBA delivery modes are supported';
  static DOCUMENTATION = 'only poll and ping CIBA delivery modes are supported';
  static ERROR_SOURCE = 'helpers/configuration.js:361';
  static UI = 'OidcProvider.exceptions.TypeError.4BB7';
}
