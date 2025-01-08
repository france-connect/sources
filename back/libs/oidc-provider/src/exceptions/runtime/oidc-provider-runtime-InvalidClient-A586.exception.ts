/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClient_A586_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'A586';
  static ERROR_CLASS = 'InvalidClient';
  static ERROR_DETAIL = 'client is invalid, client not found';
  static DOCUMENTATION = 'client is invalid, client not found';
  static ERROR_SOURCE = 'actions/authorization/check_client.js:83';
  static UI = 'OidcProvider.exceptions.InvalidClient.A586';
}
