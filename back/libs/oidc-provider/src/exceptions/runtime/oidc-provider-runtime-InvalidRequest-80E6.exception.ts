/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_80E6_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '80E6';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'invalid authorization header value format';
  static DOCUMENTATION = 'invalid authorization header value format';
  static ERROR_SOURCE = 'helpers/oidc_context.js:266';
  static UI = 'OidcProvider.exceptions.InvalidRequest.80E6';
}
