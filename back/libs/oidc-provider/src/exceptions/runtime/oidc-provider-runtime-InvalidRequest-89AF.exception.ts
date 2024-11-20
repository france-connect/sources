/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_89AF_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '89AF';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'origin ${origin} not allowed for client: ${client.clientId}';
  static DOCUMENTATION =
    'origin ${origin} not allowed for client: ${client.clientId}';
  static ERROR_SOURCE = 'shared/cors.js:18';
  static UI = 'OidcProvider.exceptions.InvalidRequest.89AF';
}
