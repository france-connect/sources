/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_32FE_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '32FE';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL =
    'expected claims to be an object, are you sure claims() method resolves with or returns one?';
  static DOCUMENTATION =
    'expected claims to be an object, are you sure claims() method resolves with or returns one?';
  static ERROR_SOURCE = 'helpers/claims.js:14';
  static UI = 'OidcProvider.exceptions.TypeError.32FE';
}
