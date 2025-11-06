/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_6A4F1_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '6A4F1';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'introspection must be requested with Accept: ${JWT} for this client';
  static DOCUMENTATION =
    'introspection must be requested with Accept: ${JWT} for this client';
  static ERROR_SOURCE = 'actions/introspection.js:75';
  static UI = 'OidcProvider.exceptions.InvalidRequest.6A4F1';
}
