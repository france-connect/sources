/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_67882_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '67882';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'client_id does not match the provided id_token_hint';
  static DOCUMENTATION = 'client_id does not match the provided id_token_hint';
  static ERROR_SOURCE = 'actions/end_session.js:38';
  static UI = 'OidcProvider.exceptions.InvalidRequest.67882';
}
