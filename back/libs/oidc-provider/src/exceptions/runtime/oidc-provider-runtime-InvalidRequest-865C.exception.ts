/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_865C_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '865C';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'no access token provided';
  static DOCUMENTATION = 'no access token provided';
  static ERROR_SOURCE = 'helpers/oidc_context.js:236';
  static UI = 'OidcProvider.exceptions.InvalidRequest.865C';
}
