/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_E15C_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'E15C';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'client authentication must only be provided using one mechanism';
  static DOCUMENTATION =
    'client authentication must only be provided using one mechanism';
  static ERROR_SOURCE = 'shared/token_auth.js:103';
  static UI = 'OidcProvider.exceptions.InvalidRequest.E15C';
}
