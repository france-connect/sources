/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClient_1E06_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '1E06';
  static ERROR_CLASS = 'InvalidClient';
  static ERROR_DETAIL = 'unrecognized id_token_hint audience, client not found';
  static DOCUMENTATION =
    'unrecognized id_token_hint audience, client not found';
  static ERROR_SOURCE = 'actions/end_session.js:45';
  static UI = 'OidcProvider.exceptions.InvalidClient.1E06';
}
