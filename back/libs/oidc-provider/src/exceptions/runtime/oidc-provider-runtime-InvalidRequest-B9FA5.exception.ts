/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_B9FA5_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'B9FA5';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'missing one of required parameters login_hint_token, id_token_hint, or login_hint';
  static DOCUMENTATION =
    'missing one of required parameters login_hint_token, id_token_hint, or login_hint';
  static ERROR_SOURCE = 'actions/authorization/ciba_load_account.js:23';
  static UI = 'OidcProvider.exceptions.InvalidRequest.B9FA5';
}
