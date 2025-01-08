/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_D6C5_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'D6C5';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL =
    'prompt none is special, cannot be registered like this';
  static DOCUMENTATION =
    'prompt none is special, cannot be registered like this';
  static ERROR_SOURCE = 'helpers/interaction_policy/prompt.js:23';
  static UI = 'OidcProvider.exceptions.Error.D6C5';
}
