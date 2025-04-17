/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_FCAA_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'FCAA';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL = 'clientId and client mismatch';
  static DOCUMENTATION = 'clientId and client mismatch';
  static ERROR_SOURCE = 'models/formats/jwt.js:110';
  static UI = 'OidcProvider.exceptions.TypeError.FCAA';
}
