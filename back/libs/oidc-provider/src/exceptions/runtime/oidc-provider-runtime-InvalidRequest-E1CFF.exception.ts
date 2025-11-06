/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_E1CFF_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'E1CFF';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'invalid client_assertion format';
  static DOCUMENTATION = 'invalid client_assertion format';
  static ERROR_SOURCE = 'shared/client_auth.js:120';
  static UI = 'OidcProvider.exceptions.InvalidRequest.E1CFF';
}
