/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_A079C_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'A079C';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = '${param} contains invalid characters';
  static DOCUMENTATION = '${param} contains invalid characters';
  static ERROR_SOURCE = 'helpers/pkce_format.js:15';
  static UI = 'OidcProvider.exceptions.InvalidRequest.A079C';
}
