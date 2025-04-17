/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_1825_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '1825';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'mismatch in body and authorization client ids';
  static DOCUMENTATION = 'mismatch in body and authorization client ids';
  static ERROR_SOURCE = 'shared/token_auth.js:95';
  static UI = 'OidcProvider.exceptions.InvalidRequest.1825';
}
