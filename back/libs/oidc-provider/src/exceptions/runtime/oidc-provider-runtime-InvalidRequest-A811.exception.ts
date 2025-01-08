/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_A811_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'A811';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'request_uri parameter must not be used at the pushed_authorization_request_endpoint';
  static DOCUMENTATION =
    'request_uri parameter must not be used at the pushed_authorization_request_endpoint';
  static ERROR_SOURCE = 'actions/authorization/strip_outside_jar_params.js:17';
  static UI = 'OidcProvider.exceptions.InvalidRequest.A811';
}
