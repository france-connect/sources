/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequestUri_9B9F_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '9B9F';
  static ERROR_CLASS = 'InvalidRequestUri';
  static ERROR_DETAIL = 'request_uri is invalid or expired';
  static DOCUMENTATION = 'request_uri is invalid or expired';
  static ERROR_SOURCE =
    'actions/authorization/load_pushed_authorization_request.js:11';
  static UI = 'OidcProvider.exceptions.InvalidRequestUri.9B9F';
}
