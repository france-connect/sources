/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_1233_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '1233';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'invalid authorization header value format';
  static DOCUMENTATION = 'invalid authorization header value format';
  static ERROR_SOURCE = 'shared/token_auth.js:75';
  static UI = 'OidcProvider.exceptions.InvalidRequest.1233';
}
