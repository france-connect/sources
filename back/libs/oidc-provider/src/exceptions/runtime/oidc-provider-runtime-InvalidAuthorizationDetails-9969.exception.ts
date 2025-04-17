/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidAuthorizationDetails_9969_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '9969';
  static ERROR_CLASS = 'InvalidAuthorizationDetails';
  static ERROR_DETAIL =
    'authorization details type "${detail.type}" is not allowed for this client';
  static DOCUMENTATION =
    'authorization details type "${detail.type}" is not allowed for this client';
  static ERROR_SOURCE = 'shared/check_rar.js:53';
  static UI = 'OidcProvider.exceptions.InvalidAuthorizationDetails.9969';
}
