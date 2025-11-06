/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_98157_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '98157';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL =
    'features.richAuthorizationRequests.types["${k}"].validate must be a function';
  static DOCUMENTATION =
    'features.richAuthorizationRequests.types["${k}"].validate must be a function';
  static ERROR_SOURCE = 'helpers/configuration.js:83';
  static UI = 'OidcProvider.exceptions.TypeError.98157';
}
