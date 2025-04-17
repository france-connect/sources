/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_5D01_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '5D01';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'client_id and client_secret in the authorization header are not properly encoded';
  static DOCUMENTATION =
    'client_id and client_secret in the authorization header are not properly encoded';
  static ERROR_SOURCE = 'shared/token_auth.js:91';
  static UI = 'OidcProvider.exceptions.InvalidRequest.5D01';
}
