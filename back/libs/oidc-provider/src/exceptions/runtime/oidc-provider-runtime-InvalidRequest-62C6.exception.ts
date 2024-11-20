/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_62C6_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '62C6';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'Pushed Authorization Request must be used';
  static DOCUMENTATION = 'Pushed Authorization Request must be used';
  static ERROR_SOURCE = 'actions/authorization/process_request_object.js:19';
  static UI = 'OidcProvider.exceptions.InvalidRequest.62C6';
}
