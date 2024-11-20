/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_E7C1_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'E7C1';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'client does not have permission to read its record, 403';
  static DOCUMENTATION =
    'client does not have permission to read its record, 403';
  static ERROR_SOURCE = 'actions/registration.js:162';
  static UI = 'OidcProvider.exceptions.InvalidRequest.E7C1';
}
