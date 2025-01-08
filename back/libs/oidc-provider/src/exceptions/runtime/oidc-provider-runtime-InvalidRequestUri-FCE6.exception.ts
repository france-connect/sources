/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequestUri_FCE6_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'FCE6';
  static ERROR_CLASS = 'InvalidRequestUri';
  static ERROR_DETAIL = 'invalid request_uri scheme';
  static DOCUMENTATION = 'invalid request_uri scheme';
  static ERROR_SOURCE = 'actions/authorization/fetch_request_uri.js:37';
  static UI = 'OidcProvider.exceptions.InvalidRequestUri.FCE6';
}
