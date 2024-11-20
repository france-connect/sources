/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_errors_InvalidBindingMessage_CC6E_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'CC6E';
  static ERROR_CLASS = 'errors_InvalidBindingMessage';
  static ERROR_DETAIL =
    'the binding_message value, when provided, needs to be 1 - 20 characters in length and use only a basic set of characters (matching the regex: ^[a-zA-Z0-9-._+/!?#]{1,20}$ )';
  static DOCUMENTATION =
    'the binding_message value, when provided, needs to be 1 - 20 characters in length and use only a basic set of characters (matching the regex: ^[a-zA-Z0-9-._+/!?#]{1,20}$ )';
  static ERROR_SOURCE = 'helpers/defaults.js:517';
  static UI = 'OidcProvider.exceptions.errors_InvalidBindingMessage.CC6E';
}
