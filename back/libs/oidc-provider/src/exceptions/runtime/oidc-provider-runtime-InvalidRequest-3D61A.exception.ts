/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_3D61A_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '3D61A';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'authorization header scheme must be "Bearer"';
  static DOCUMENTATION = 'authorization header scheme must be "Bearer"';
  static ERROR_SOURCE = 'helpers/oidc_context.js:269';
  static UI = 'OidcProvider.exceptions.InvalidRequest.3D61A';
}
