/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_DADA6_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'DADA6';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'client authentication must only be provided using one mechanism';
  static DOCUMENTATION =
    'client authentication must only be provided using one mechanism';
  static ERROR_SOURCE = 'shared/client_auth.js:100';
  static UI = 'OidcProvider.exceptions.InvalidRequest.DADA6';
}
