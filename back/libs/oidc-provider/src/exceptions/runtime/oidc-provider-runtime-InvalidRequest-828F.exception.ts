/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_828F_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '828F';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'access tokens must not be provided via query parameter';
  static DOCUMENTATION =
    'access tokens must not be provided via query parameter';
  static ERROR_SOURCE = 'helpers/oidc_context.js:256';
  static UI = 'OidcProvider.exceptions.InvalidRequest.828F';
}
