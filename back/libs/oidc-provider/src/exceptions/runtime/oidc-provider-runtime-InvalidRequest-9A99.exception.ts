/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_9A99_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '9A99';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'client_assertion_type must be provided';
  static DOCUMENTATION = 'client_assertion_type must be provided';
  static ERROR_SOURCE = 'shared/token_auth.js:126';
  static UI = 'OidcProvider.exceptions.InvalidRequest.9A99';
}
