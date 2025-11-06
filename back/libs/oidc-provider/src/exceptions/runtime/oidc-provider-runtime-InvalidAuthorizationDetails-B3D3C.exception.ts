/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidAuthorizationDetails_B3D3C_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'B3D3C';
  static ERROR_CLASS = 'InvalidAuthorizationDetails';
  static ERROR_DETAIL =
    '"${field}" must be an array of non-empty strings (authorization details index ${i})';
  static DOCUMENTATION =
    '"${field}" must be an array of non-empty strings (authorization details index ${i})';
  static ERROR_SOURCE = 'shared/check_rar.js:59';
  static UI = 'OidcProvider.exceptions.InvalidAuthorizationDetails.B3D3C';
}
