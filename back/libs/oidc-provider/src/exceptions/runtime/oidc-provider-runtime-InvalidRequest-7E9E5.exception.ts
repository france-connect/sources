/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_7E9E5_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '7E9E5';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'client authentication must only be provided using one mechanism';
  static DOCUMENTATION =
    'client authentication must only be provided using one mechanism';
  static ERROR_SOURCE = 'shared/client_auth.js:113';
  static UI = 'OidcProvider.exceptions.InvalidRequest.7E9E5';
}
