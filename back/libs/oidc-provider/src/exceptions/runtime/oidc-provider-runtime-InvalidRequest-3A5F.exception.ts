/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_3A5F_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '3A5F';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'invalid max_age parameter value';
  static DOCUMENTATION = 'invalid max_age parameter value';
  static ERROR_SOURCE = 'actions/authorization/check_max_age.js:13';
  static UI = 'OidcProvider.exceptions.InvalidRequest.3A5F';
}
