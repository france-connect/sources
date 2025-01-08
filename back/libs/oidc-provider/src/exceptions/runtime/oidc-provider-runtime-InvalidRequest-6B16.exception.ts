/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_6B16_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '6B16';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'mismatch in body and authorization client ids';
  static DOCUMENTATION = 'mismatch in body and authorization client ids';
  static ERROR_SOURCE = 'shared/token_auth.js:86';
  static UI = 'OidcProvider.exceptions.InvalidRequest.6B16';
}
