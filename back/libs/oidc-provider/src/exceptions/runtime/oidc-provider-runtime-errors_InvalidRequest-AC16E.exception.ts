/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_errors_InvalidRequest_AC16E_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'AC16E';
  static ERROR_CLASS = 'errors_InvalidRequest';
  static ERROR_DETAIL = '"origin" is required for this request';
  static DOCUMENTATION = '"origin" is required for this request';
  static ERROR_SOURCE = 'helpers/defaults.js:890';
  static UI = 'OidcProvider.exceptions.errors_InvalidRequest.AC16E';
}
