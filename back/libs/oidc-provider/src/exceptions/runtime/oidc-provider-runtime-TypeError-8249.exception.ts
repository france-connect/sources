/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_8249_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '8249';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL =
    'accountId must be a non-empty string, got: ${typeof value}';
  static DOCUMENTATION =
    'accountId must be a non-empty string, got: ${typeof value}';
  static ERROR_SOURCE = 'shared/session.js:17';
  static UI = 'OidcProvider.exceptions.TypeError.8249';
}
