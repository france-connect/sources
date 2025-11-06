/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_1E235_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '1E235';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL = 'unsupported enabledJWA.${key} algorithm provided';
  static DOCUMENTATION = 'unsupported enabledJWA.${key} algorithm provided';
  static ERROR_SOURCE = 'helpers/configuration.js:249';
  static UI = 'OidcProvider.exceptions.TypeError.1E235';
}
