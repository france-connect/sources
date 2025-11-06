/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidTarget_35DED_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '35DED';
  static ERROR_CLASS = 'InvalidTarget';
  static ERROR_DETAIL =
    'resource indicator must not contain a fragment component';
  static DOCUMENTATION =
    'resource indicator must not contain a fragment component';
  static ERROR_SOURCE = 'shared/check_resource.js:69';
  static UI = 'OidcProvider.exceptions.InvalidTarget.35DED';
}
