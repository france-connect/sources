/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_2137_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '2137';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'claims.id_token should be an object';
  static DOCUMENTATION = 'claims.id_token should be an object';
  static ERROR_SOURCE = 'actions/authorization/check_claims.js:50';
  static UI = 'OidcProvider.exceptions.InvalidRequest.2137';
}
