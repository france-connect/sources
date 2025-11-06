/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_5CC8C_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '5CC8C';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'client_secret must be provided in the Authorization header';
  static DOCUMENTATION =
    'client_secret must be provided in the Authorization header';
  static ERROR_SOURCE = 'shared/client_auth.js:96';
  static UI = 'OidcProvider.exceptions.InvalidRequest.5CC8C';
}
