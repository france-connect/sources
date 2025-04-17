/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_CDC7_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'CDC7';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'could not validate id_token_hint, undefined, err.message';
  static DOCUMENTATION =
    'could not validate id_token_hint, undefined, err.message';
  static ERROR_SOURCE = 'actions/end_session.js:54';
  static UI = 'OidcProvider.exceptions.InvalidRequest.CDC7';
}
