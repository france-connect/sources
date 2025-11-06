/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_8454B_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '8454B';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'subject of client_assertion must be the same as client_id provided in the body';
  static DOCUMENTATION =
    'subject of client_assertion must be the same as client_id provided in the body';
  static ERROR_SOURCE = 'shared/client_auth.js:128';
  static UI = 'OidcProvider.exceptions.InvalidRequest.8454B';
}
