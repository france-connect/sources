/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_E10A_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'E10A';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL =
    'prompt none is special, cannot be registered like this';
  static DOCUMENTATION =
    'prompt none is special, cannot be registered like this';
  static ERROR_SOURCE = 'helpers/interaction_policy/prompt.js:24';
  static UI = 'OidcProvider.exceptions.Error.E10A';
}
