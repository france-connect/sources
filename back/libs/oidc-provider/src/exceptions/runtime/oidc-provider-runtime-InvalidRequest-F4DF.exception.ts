/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_F4DF_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'F4DF';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'no client authentication mechanism provided';
  static DOCUMENTATION = 'no client authentication mechanism provided';
  static ERROR_SOURCE = 'shared/token_auth.js:138';
  static UI = 'OidcProvider.exceptions.InvalidRequest.F4DF';
}
