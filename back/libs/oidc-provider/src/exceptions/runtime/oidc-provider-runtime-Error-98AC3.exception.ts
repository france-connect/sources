/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_98AC3_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '98AC3';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL =
    'Expected "adapter" to be a constructor or a factory function, provide a valid adapter in Provider config.';
  static DOCUMENTATION =
    'Expected "adapter" to be a constructor or a factory function, provide a valid adapter in Provider config.';
  static ERROR_SOURCE = 'helpers/initialize_adapter.js:19';
  static UI = 'OidcProvider.exceptions.Error.98AC3';
}
