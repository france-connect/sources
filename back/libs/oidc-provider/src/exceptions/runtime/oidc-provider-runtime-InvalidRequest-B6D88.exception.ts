/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_B6D88_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'B6D88';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'authorization_details parameter should be a JSON array';
  static DOCUMENTATION =
    'authorization_details parameter should be a JSON array';
  static ERROR_SOURCE = 'shared/check_rar.js:29';
  static UI = 'OidcProvider.exceptions.InvalidRequest.B6D88';
}
