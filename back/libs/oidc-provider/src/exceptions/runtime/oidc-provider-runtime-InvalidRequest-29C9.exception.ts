/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_29C9_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '29C9';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'client_id does not match the provided id_token_hint';
  static DOCUMENTATION = 'client_id does not match the provided id_token_hint';
  static ERROR_SOURCE = 'actions/end_session.js:42';
  static UI = 'OidcProvider.exceptions.InvalidRequest.29C9';
}
