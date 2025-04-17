/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequestUri_2A2C_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '2A2C';
  static ERROR_CLASS = 'InvalidRequestUri';
  static ERROR_DETAIL = 'could not load or parse request_uri, err.message';
  static DOCUMENTATION = 'could not load or parse request_uri, err.message';
  static ERROR_SOURCE = 'actions/authorization/fetch_request_uri.js:56';
  static UI = 'OidcProvider.exceptions.InvalidRequestUri.2A2C';
}
