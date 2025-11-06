/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_B5401_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'B5401';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'access tokens must not be provided via query parameter';
  static DOCUMENTATION =
    'access tokens must not be provided via query parameter';
  static ERROR_SOURCE = 'helpers/oidc_context.js:251';
  static UI = 'OidcProvider.exceptions.InvalidRequest.B5401';
}
