/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_UnauthorizedClient_632E_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '632E';
  static ERROR_CLASS = 'UnauthorizedClient';
  static ERROR_DETAIL = 'requested grant type is not allowed for this client';
  static DOCUMENTATION = 'requested grant type is not allowed for this client';
  static ERROR_SOURCE = 'actions/token.js:50';
  static UI = 'OidcProvider.exceptions.UnauthorizedClient.632E';
}
