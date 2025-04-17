/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_804D_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '804D';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL =
    'features.richAuthorizationRequests.types attribute values must be objects';
  static DOCUMENTATION =
    'features.richAuthorizationRequests.types attribute values must be objects';
  static ERROR_SOURCE = 'helpers/configuration.js:112';
  static UI = 'OidcProvider.exceptions.TypeError.804D';
}
