/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_E55D_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'E55D';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    '${param} must be a string with a maximum length of 128 characters';
  static DOCUMENTATION =
    '${param} must be a string with a maximum length of 128 characters';
  static ERROR_SOURCE = 'helpers/pkce_format.js:11';
  static UI = 'OidcProvider.exceptions.InvalidRequest.E55D';
}
