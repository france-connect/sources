/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_3B018_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '3B018';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'detail.replace("redirect_uris", "redirect_uri")';
  static DOCUMENTATION = 'detail.replace("redirect_uris", "redirect_uri")';
  static ERROR_SOURCE = 'actions/authorization/check_redirect_uri.js:19';
  static UI = 'OidcProvider.exceptions.InvalidRequest.3B018';
}
