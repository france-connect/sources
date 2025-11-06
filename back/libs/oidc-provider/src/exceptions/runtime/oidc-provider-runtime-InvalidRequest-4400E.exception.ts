/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_4400E_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '4400E';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'authorization_details is unsupported for this refresh token';
  static DOCUMENTATION =
    'authorization_details is unsupported for this refresh token';
  static ERROR_SOURCE = 'actions/grants/refresh_token.js:140';
  static UI = 'OidcProvider.exceptions.InvalidRequest.4400E';
}
