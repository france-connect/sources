/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_8996_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '8996';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'authorization_details is unsupported for this grant_type';
  static DOCUMENTATION =
    'authorization_details is unsupported for this grant_type';
  static ERROR_SOURCE = 'actions/grants/client_credentials.js:23';
  static UI = 'OidcProvider.exceptions.InvalidRequest.8996';
}
