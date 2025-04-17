/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_E9AA_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'E9AA';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'client_assertion_type must be provided';
  static DOCUMENTATION = 'client_assertion_type must be provided';
  static ERROR_SOURCE = 'shared/token_auth.js:135';
  static UI = 'OidcProvider.exceptions.InvalidRequest.E9AA';
}
