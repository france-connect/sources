/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClient_6CED_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '6CED';
  static ERROR_CLASS = 'InvalidClient';
  static ERROR_DETAIL = 'unrecognized id_token_hint audience, client not found';
  static DOCUMENTATION =
    'unrecognized id_token_hint audience, client not found';
  static ERROR_SOURCE = 'actions/end_session.js:46';
  static UI = 'OidcProvider.exceptions.InvalidClient.6CED';
}
