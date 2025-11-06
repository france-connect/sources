/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_5AFAE_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '5AFAE';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'could not validate id_token_hint, undefined, err.message';
  static DOCUMENTATION =
    'could not validate id_token_hint, undefined, err.message';
  static ERROR_SOURCE = 'actions/end_session.js:51';
  static UI = 'OidcProvider.exceptions.InvalidRequest.5AFAE';
}
