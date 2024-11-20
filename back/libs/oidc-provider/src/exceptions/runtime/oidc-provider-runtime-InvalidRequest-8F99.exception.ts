/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_8F99_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '8F99';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'introspection must be requested with Accept: ${JWT} for this client';
  static DOCUMENTATION =
    'introspection must be requested with Accept: ${JWT} for this client';
  static ERROR_SOURCE = 'actions/introspection.js:73';
  static UI = 'OidcProvider.exceptions.InvalidRequest.8F99';
}
