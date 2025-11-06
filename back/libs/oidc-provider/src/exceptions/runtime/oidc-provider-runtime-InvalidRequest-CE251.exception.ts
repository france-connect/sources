/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_CE251_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'CE251';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'invalid requested_expiry parameter value';
  static DOCUMENTATION = 'invalid requested_expiry parameter value';
  static ERROR_SOURCE = 'actions/authorization/check_requested_expiry.js:11';
  static UI = 'OidcProvider.exceptions.InvalidRequest.CE251';
}
