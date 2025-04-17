/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_26C6_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '26C6';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'client_assertion_type must have value ${assertionType}';
  static DOCUMENTATION =
    'client_assertion_type must have value ${assertionType}';
  static ERROR_SOURCE = 'shared/token_auth.js:139';
  static UI = 'OidcProvider.exceptions.InvalidRequest.26C6';
}
