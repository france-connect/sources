/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_C700_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'C700';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL = '${prop} must be an Array or Set';
  static DOCUMENTATION = '${prop} must be an Array or Set';
  static ERROR_SOURCE = 'helpers/configuration.js:126';
  static UI = 'OidcProvider.exceptions.TypeError.C700';
}
