/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_8909_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '8909';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'unsupported prompt value requested';
  static DOCUMENTATION = 'unsupported prompt value requested';
  static ERROR_SOURCE = 'actions/authorization/check_prompt.js:15';
  static UI = 'OidcProvider.exceptions.InvalidRequest.8909';
}
