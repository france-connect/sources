/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_FEDB9_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'FEDB9';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'could not decode id_token_hint, undefined, err.message';
  static DOCUMENTATION =
    'could not decode id_token_hint, undefined, err.message';
  static ERROR_SOURCE = 'actions/end_session.js:33';
  static UI = 'OidcProvider.exceptions.InvalidRequest.FEDB9';
}
