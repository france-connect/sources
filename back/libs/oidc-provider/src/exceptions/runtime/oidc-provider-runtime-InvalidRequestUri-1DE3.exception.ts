/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequestUri_1DE3_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '1DE3';
  static ERROR_CLASS = 'InvalidRequestUri';
  static ERROR_DETAIL = 'provided request_uri is not allowed';
  static DOCUMENTATION = 'provided request_uri is not allowed';
  static ERROR_SOURCE = 'actions/authorization/fetch_request_uri.js:51';
  static UI = 'OidcProvider.exceptions.InvalidRequestUri.1DE3';
}
