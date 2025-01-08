/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_E9EB_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'E9EB';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'invalid authorization header value format';
  static DOCUMENTATION = 'invalid authorization header value format';
  static ERROR_SOURCE = 'shared/token_auth.js:68';
  static UI = 'OidcProvider.exceptions.InvalidRequest.E9EB';
}
