/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_E362_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'E362';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'request and request_uri parameters MUST NOT be used together';
  static DOCUMENTATION =
    'request and request_uri parameters MUST NOT be used together';
  static ERROR_SOURCE = 'actions/authorization/reject_request_and_uri.js:10';
  static UI = 'OidcProvider.exceptions.InvalidRequest.E362';
}
