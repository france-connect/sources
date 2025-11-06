/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidAuthorizationDetails_B20B6_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'B20B6';
  static ERROR_CLASS = 'InvalidAuthorizationDetails';
  static ERROR_DETAIL =
    'unsupported authorization details type value (authorization details index ${i})';
  static DOCUMENTATION =
    'unsupported authorization details type value (authorization details index ${i})';
  static ERROR_SOURCE = 'shared/check_rar.js:49';
  static UI = 'OidcProvider.exceptions.InvalidAuthorizationDetails.B20B6';
}
