/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_F7D1_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'F7D1';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    '${param} must be a string with a minimum length of 43 characters';
  static DOCUMENTATION =
    '${param} must be a string with a minimum length of 43 characters';
  static ERROR_SOURCE = 'helpers/pkce_format.js:7';
  static UI = 'OidcProvider.exceptions.InvalidRequest.F7D1';
}
