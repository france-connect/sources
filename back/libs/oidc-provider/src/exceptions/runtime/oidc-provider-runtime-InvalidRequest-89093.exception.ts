/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_89093_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '89093';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'unsupported prompt value requested';
  static DOCUMENTATION = 'unsupported prompt value requested';
  static ERROR_SOURCE = 'actions/authorization/check_prompt.js:15';
  static UI = 'OidcProvider.exceptions.InvalidRequest.89093';
}
