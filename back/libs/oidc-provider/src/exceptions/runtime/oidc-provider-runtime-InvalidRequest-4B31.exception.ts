/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_4B31_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '4B31';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'client authentication must only be provided using one mechanism';
  static DOCUMENTATION =
    'client authentication must only be provided using one mechanism';
  static ERROR_SOURCE = 'shared/token_auth.js:107';
  static UI = 'OidcProvider.exceptions.InvalidRequest.4B31';
}
