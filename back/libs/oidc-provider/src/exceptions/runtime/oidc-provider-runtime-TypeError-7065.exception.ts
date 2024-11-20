/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_7065_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '7065';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL = 'unsupported enabledJWA.${key} algorithm provided';
  static DOCUMENTATION = 'unsupported enabledJWA.${key} algorithm provided';
  static ERROR_SOURCE = 'helpers/configuration.js:257';
  static UI = 'OidcProvider.exceptions.TypeError.7065';
}
