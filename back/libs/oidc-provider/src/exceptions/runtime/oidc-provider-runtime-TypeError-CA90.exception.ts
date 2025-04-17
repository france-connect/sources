/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_CA90_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'CA90';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL = '"signal" http request option must be an AbortSignal';
  static DOCUMENTATION = '"signal" http request option must be an AbortSignal';
  static ERROR_SOURCE = 'helpers/request.js:27';
  static UI = 'OidcProvider.exceptions.TypeError.CA90';
}
