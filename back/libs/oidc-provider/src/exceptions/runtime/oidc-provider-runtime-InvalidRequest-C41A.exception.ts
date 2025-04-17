/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_C41A_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'C41A';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = '"DPoP" header not provided';
  static DOCUMENTATION = '"DPoP" header not provided';
  static ERROR_SOURCE = 'helpers/oidc_context.js:272';
  static UI = 'OidcProvider.exceptions.InvalidRequest.C41A';
}
