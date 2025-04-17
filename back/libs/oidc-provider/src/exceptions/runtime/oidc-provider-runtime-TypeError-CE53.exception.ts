/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_CE53_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'CE53';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL = 'unsupported enabledJWA.${key} algorithm provided';
  static DOCUMENTATION = 'unsupported enabledJWA.${key} algorithm provided';
  static ERROR_SOURCE = 'helpers/configuration.js:278';
  static UI = 'OidcProvider.exceptions.TypeError.CE53';
}
