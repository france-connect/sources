/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_E2A9_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'E2A9';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'could not validate id_token_hint, undefined, err.message';
  static DOCUMENTATION =
    'could not validate id_token_hint, undefined, err.message';
  static ERROR_SOURCE = 'actions/authorization/check_id_token_hint.js:17';
  static UI = 'OidcProvider.exceptions.InvalidRequest.E2A9';
}
