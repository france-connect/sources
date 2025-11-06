/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_5C2CE_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '5C2CE';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'only one of required parameters login_hint_token, id_token_hint, or login_hint must be provided';
  static DOCUMENTATION =
    'only one of required parameters login_hint_token, id_token_hint, or login_hint must be provided';
  static ERROR_SOURCE = 'actions/authorization/ciba_load_account.js:25';
  static UI = 'OidcProvider.exceptions.InvalidRequest.5C2CE';
}
