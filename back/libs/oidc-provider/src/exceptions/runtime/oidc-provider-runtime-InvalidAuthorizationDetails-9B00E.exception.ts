/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidAuthorizationDetails_9B00E_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '9B00E';
  static ERROR_CLASS = 'InvalidAuthorizationDetails';
  static ERROR_DETAIL =
    '"identifier" must be a non-empty string (authorization details index ${i})';
  static DOCUMENTATION =
    '"identifier" must be a non-empty string (authorization details index ${i})';
  static ERROR_SOURCE = 'shared/check_rar.js:63';
  static UI = 'OidcProvider.exceptions.InvalidAuthorizationDetails.9B00E';
}
