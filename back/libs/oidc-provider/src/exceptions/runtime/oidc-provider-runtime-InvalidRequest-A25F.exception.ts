/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_A25F_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'A25F';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'failed to parse the request body';
  static DOCUMENTATION = 'failed to parse the request body';
  static ERROR_SOURCE = 'shared/selective_body.js:46';
  static UI = 'OidcProvider.exceptions.InvalidRequest.A25F';
}
