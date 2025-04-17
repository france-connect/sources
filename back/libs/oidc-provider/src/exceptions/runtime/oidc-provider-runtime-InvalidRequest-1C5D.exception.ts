/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_1C5D_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '1C5D';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'prompt none must only be used alone';
  static DOCUMENTATION = 'prompt none must only be used alone';
  static ERROR_SOURCE = 'actions/authorization/check_prompt.js:20';
  static UI = 'OidcProvider.exceptions.InvalidRequest.1C5D';
}
