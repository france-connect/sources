/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClient_FC55_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'FC55';
  static ERROR_CLASS = 'InvalidClient';
  static ERROR_DETAIL = 'client is invalid, client not found';
  static DOCUMENTATION = 'client is invalid, client not found';
  static ERROR_SOURCE = 'actions/end_session.js:226';
  static UI = 'OidcProvider.exceptions.InvalidClient.FC55';
}
