/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_5E62_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '5E62';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'Authorization Server policy requires PKCE to be used for this request';
  static DOCUMENTATION =
    'Authorization Server policy requires PKCE to be used for this request';
  static ERROR_SOURCE = 'actions/authorization/check_pkce.js:37';
  static UI = 'OidcProvider.exceptions.InvalidRequest.5E62';
}
