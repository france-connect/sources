/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_11CA_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '11CA';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL = '${prop} must be an Array or Set';
  static DOCUMENTATION = '${prop} must be an Array or Set';
  static ERROR_SOURCE = 'helpers/configuration.js:147';
  static UI = 'OidcProvider.exceptions.TypeError.11CA';
}
