/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_23A5_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '23A5';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'access tokens must not be provided via query parameter';
  static DOCUMENTATION =
    'access tokens must not be provided via query parameter';
  static ERROR_SOURCE = 'helpers/oidc_context.js:244';
  static UI = 'OidcProvider.exceptions.InvalidRequest.23A5';
}
