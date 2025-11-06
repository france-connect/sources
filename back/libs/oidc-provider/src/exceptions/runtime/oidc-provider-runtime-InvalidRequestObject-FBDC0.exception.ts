/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequestObject_FBDC0_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'FBDC0';
  static ERROR_CLASS = 'InvalidRequestObject';
  static ERROR_DETAIL =
    'the preregistered alg must be used in request or request_uri';
  static DOCUMENTATION =
    'the preregistered alg must be used in request or request_uri';
  static ERROR_SOURCE = 'actions/authorization/process_request_object.js:149';
  static UI = 'OidcProvider.exceptions.InvalidRequestObject.FBDC0';
}
