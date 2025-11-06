/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_19ECE_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '19ECE';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'mismatch in body and authorization client ids';
  static DOCUMENTATION = 'mismatch in body and authorization client ids';
  static ERROR_SOURCE = 'shared/client_auth.js:92';
  static UI = 'OidcProvider.exceptions.InvalidRequest.19ECE';
}
