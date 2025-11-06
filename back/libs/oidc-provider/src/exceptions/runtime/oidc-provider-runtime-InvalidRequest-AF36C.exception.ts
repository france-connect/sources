/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_AF36C_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'AF36C';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'client_assertion_type must be provided';
  static DOCUMENTATION = 'client_assertion_type must be provided';
  static ERROR_SOURCE = 'shared/client_auth.js:132';
  static UI = 'OidcProvider.exceptions.InvalidRequest.AF36C';
}
