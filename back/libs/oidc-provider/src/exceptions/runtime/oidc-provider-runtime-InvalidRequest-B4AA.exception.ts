/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_B4AA_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'B4AA';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'client does not have permission to update its record, 403';
  static DOCUMENTATION =
    'client does not have permission to update its record, 403';
  static ERROR_SOURCE = 'actions/registration.js:205';
  static UI = 'OidcProvider.exceptions.InvalidRequest.B4AA';
}
