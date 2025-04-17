/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_errors_InvalidRequest_E983_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'E983';
  static ERROR_CLASS = 'errors_InvalidRequest';
  static ERROR_DETAIL = 'requested "origin" is not allowed for this client';
  static DOCUMENTATION = 'requested "origin" is not allowed for this client';
  static ERROR_SOURCE = 'helpers/defaults.js:915';
  static UI = 'OidcProvider.exceptions.errors_InvalidRequest.E983';
}
