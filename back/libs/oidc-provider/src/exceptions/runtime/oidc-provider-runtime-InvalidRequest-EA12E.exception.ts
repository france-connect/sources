/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_EA12E_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'EA12E';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'client_assertion_type must have value ${assertionType}';
  static DOCUMENTATION =
    'client_assertion_type must have value ${assertionType}';
  static ERROR_SOURCE = 'shared/client_auth.js:136';
  static UI = 'OidcProvider.exceptions.InvalidRequest.EA12E';
}
