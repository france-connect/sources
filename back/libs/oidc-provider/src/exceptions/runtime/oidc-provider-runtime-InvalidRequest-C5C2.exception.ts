/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_C5C2_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'C5C2';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'authorization header scheme must be Bearer';
  static DOCUMENTATION = 'authorization header scheme must be Bearer';
  static ERROR_SOURCE = 'helpers/oidc_context.js:262';
  static UI = 'OidcProvider.exceptions.InvalidRequest.C5C2';
}
