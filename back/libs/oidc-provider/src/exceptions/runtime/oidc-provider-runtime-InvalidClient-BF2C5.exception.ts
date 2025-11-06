/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClient_BF2C5_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'BF2C5';
  static ERROR_CLASS = 'InvalidClient';
  static ERROR_DETAIL = 'client is invalid, client not found';
  static DOCUMENTATION = 'client is invalid, client not found';
  static ERROR_SOURCE = 'actions/end_session.js:57';
  static UI = 'OidcProvider.exceptions.InvalidClient.BF2C5';
}
