/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_6EF7_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '6EF7';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'response_mode not allowed for this response_type';
  static DOCUMENTATION = 'response_mode not allowed for this response_type';
  static ERROR_SOURCE = 'actions/authorization/check_response_mode.js:45';
  static UI = 'OidcProvider.exceptions.InvalidRequest.6EF7';
}
