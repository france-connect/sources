/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_8F18_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '8F18';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'client_secret must be provided in the Authorization header';
  static DOCUMENTATION =
    'client_secret must be provided in the Authorization header';
  static ERROR_SOURCE = 'shared/token_auth.js:90';
  static UI = 'OidcProvider.exceptions.InvalidRequest.8F18';
}
