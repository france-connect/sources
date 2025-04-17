/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_2D52_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '2D52';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'client does not have permission to delete its record, 403';
  static DOCUMENTATION =
    'client does not have permission to delete its record, 403';
  static ERROR_SOURCE = 'actions/registration.js:280';
  static UI = 'OidcProvider.exceptions.InvalidRequest.2D52';
}
