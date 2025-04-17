/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_F84F_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'F84F';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL =
    'expected claims to be an object, are you sure claims() method resolves with or returns one?';
  static DOCUMENTATION =
    'expected claims to be an object, are you sure claims() method resolves with or returns one?';
  static ERROR_SOURCE = 'models/id_token.js:34';
  static UI = 'OidcProvider.exceptions.TypeError.F84F';
}
