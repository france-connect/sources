/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_29FB_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '29FB';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'unsupported prompt value requested';
  static DOCUMENTATION = 'unsupported prompt value requested';
  static ERROR_SOURCE = 'actions/authorization/check_prompt.js:17';
  static UI = 'OidcProvider.exceptions.InvalidRequest.29FB';
}
