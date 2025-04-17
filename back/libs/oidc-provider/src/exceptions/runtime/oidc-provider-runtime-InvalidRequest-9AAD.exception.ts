/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_9AAD_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '9AAD';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'invalid max_age parameter value';
  static DOCUMENTATION = 'invalid max_age parameter value';
  static ERROR_SOURCE = 'actions/authorization/check_max_age.js:11';
  static UI = 'OidcProvider.exceptions.InvalidRequest.9AAD';
}
