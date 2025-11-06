/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequestUri_3C1F7_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '3C1F7';
  static ERROR_CLASS = 'InvalidRequestUri';
  static ERROR_DETAIL = 'request_uri is invalid, expired, or was already used';
  static DOCUMENTATION = 'request_uri is invalid, expired, or was already used';
  static ERROR_SOURCE =
    'actions/authorization/load_pushed_authorization_request.js:26';
  static UI = 'OidcProvider.exceptions.InvalidRequestUri.3C1F7';
}
