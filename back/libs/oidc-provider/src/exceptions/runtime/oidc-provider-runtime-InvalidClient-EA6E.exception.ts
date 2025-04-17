/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClient_EA6E_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'EA6E';
  static ERROR_CLASS = 'InvalidClient';
  static ERROR_DETAIL = 'client is invalid, client not found';
  static DOCUMENTATION = 'client is invalid, client not found';
  static ERROR_SOURCE = 'actions/authorization/check_client.js:15';
  static UI = 'OidcProvider.exceptions.InvalidClient.EA6E';
}
