/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_DFBD_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'DFBD';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'subject of client_assertion must be the same as client_id provided in the body';
  static DOCUMENTATION =
    'subject of client_assertion must be the same as client_id provided in the body';
  static ERROR_SOURCE = 'shared/token_auth.js:122';
  static UI = 'OidcProvider.exceptions.InvalidRequest.DFBD';
}
