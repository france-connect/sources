/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_FB1D_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'FB1D';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL = 'reason must be a string';
  static DOCUMENTATION = 'reason must be a string';
  static ERROR_SOURCE = 'helpers/interaction_policy/prompt.js:69';
  static UI = 'OidcProvider.exceptions.TypeError.FB1D';
}
