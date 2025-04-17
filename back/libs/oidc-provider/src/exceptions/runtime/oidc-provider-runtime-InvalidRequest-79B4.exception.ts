/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_79B4_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '79B4';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'could not parse the authorization_details parameter JSON';
  static DOCUMENTATION =
    'could not parse the authorization_details parameter JSON';
  static ERROR_SOURCE = 'shared/check_rar.js:25';
  static UI = 'OidcProvider.exceptions.InvalidRequest.79B4';
}
