/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidTarget_6E3E0_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '6E3E0';
  static ERROR_CLASS = 'InvalidTarget';
  static ERROR_DETAIL =
    'resource indicator must be provided or defaulted to when Rich Authorization Requests are used';
  static DOCUMENTATION =
    'resource indicator must be provided or defaulted to when Rich Authorization Requests are used';
  static ERROR_SOURCE = 'shared/check_resource.js:40';
  static UI = 'OidcProvider.exceptions.InvalidTarget.6E3E0';
}
