/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_BCAF_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'BCAF';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'prompt none must only be used alone';
  static DOCUMENTATION = 'prompt none must only be used alone';
  static ERROR_SOURCE = 'actions/authorization/check_prompt.js:22';
  static UI = 'OidcProvider.exceptions.InvalidRequest.BCAF';
}
