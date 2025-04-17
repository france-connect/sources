/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_B2C1_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'B2C1';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'invalid authorization header value format';
  static DOCUMENTATION = 'invalid authorization header value format';
  static ERROR_SOURCE = 'shared/token_auth.js:77';
  static UI = 'OidcProvider.exceptions.InvalidRequest.B2C1';
}
