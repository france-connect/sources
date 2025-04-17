/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_79F4_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '79F4';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'xsrf token invalid';
  static DOCUMENTATION = 'xsrf token invalid';
  static ERROR_SOURCE = 'actions/end_session.js:120';
  static UI = 'OidcProvider.exceptions.InvalidRequest.79F4';
}
