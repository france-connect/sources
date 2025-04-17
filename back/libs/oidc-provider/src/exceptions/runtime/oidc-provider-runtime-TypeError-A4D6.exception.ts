/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_A4D6_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'A4D6';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL = '"user-agent" http request option must be a string';
  static DOCUMENTATION = '"user-agent" http request option must be a string';
  static ERROR_SOURCE = 'helpers/request.js:39';
  static UI = 'OidcProvider.exceptions.TypeError.A4D6';
}
