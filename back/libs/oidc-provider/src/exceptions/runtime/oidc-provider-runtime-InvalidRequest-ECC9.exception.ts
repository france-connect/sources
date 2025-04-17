/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_ECC9_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'ECC9';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'no access token provided';
  static DOCUMENTATION = 'no access token provided';
  static ERROR_SOURCE = 'helpers/oidc_context.js:248';
  static UI = 'OidcProvider.exceptions.InvalidRequest.ECC9';
}
