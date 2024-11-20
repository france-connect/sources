/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_CC3A_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'CC3A';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL = 'invalid property enabledJWA.${key} provided';
  static DOCUMENTATION = 'invalid property enabledJWA.${key} provided';
  static ERROR_SOURCE = 'helpers/configuration.js:248';
  static UI = 'OidcProvider.exceptions.TypeError.CC3A';
}
