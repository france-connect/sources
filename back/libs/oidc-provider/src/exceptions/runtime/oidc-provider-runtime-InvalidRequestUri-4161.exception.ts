/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequestUri_4161_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '4161';
  static ERROR_CLASS = 'InvalidRequestUri';
  static ERROR_DETAIL = 'provided request_uri is not allowed';
  static DOCUMENTATION = 'provided request_uri is not allowed';
  static ERROR_SOURCE = 'actions/authorization/fetch_request_uri.js:38';
  static UI = 'OidcProvider.exceptions.InvalidRequestUri.4161';
}
