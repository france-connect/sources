/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_EA5AE_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'EA5AE';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'authorization_details parameter members should be a JSON object';
  static DOCUMENTATION =
    'authorization_details parameter members should be a JSON object';
  static ERROR_SOURCE = 'shared/check_rar.js:40';
  static UI = 'OidcProvider.exceptions.InvalidRequest.EA5AE';
}
