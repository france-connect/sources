/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequestUri_446A_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '446A';
  static ERROR_CLASS = 'InvalidRequestUri';
  static ERROR_DETAIL =
    'only request_uri values from the pushed_authorization_request_endpoint are allowed';
  static DOCUMENTATION =
    'only request_uri values from the pushed_authorization_request_endpoint are allowed';
  static ERROR_SOURCE = 'actions/authorization/fetch_request_uri.js:48';
  static UI = 'OidcProvider.exceptions.InvalidRequestUri.446A';
}
