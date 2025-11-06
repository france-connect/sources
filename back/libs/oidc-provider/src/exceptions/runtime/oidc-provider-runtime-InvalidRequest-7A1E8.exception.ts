/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_7A1E8_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '7A1E8';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'client does not have permission to update its record, 403';
  static DOCUMENTATION =
    'client does not have permission to update its record, 403';
  static ERROR_SOURCE = 'actions/registration.js:219';
  static UI = 'OidcProvider.exceptions.InvalidRequest.7A1E8';
}
