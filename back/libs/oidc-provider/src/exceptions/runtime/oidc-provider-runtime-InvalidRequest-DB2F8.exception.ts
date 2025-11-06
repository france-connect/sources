/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_DB2F8_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'DB2F8';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'authorization_details parameter is not supported for this response_type';
  static DOCUMENTATION =
    'authorization_details parameter is not supported for this response_type';
  static ERROR_SOURCE = 'shared/check_rar.js:17';
  static UI = 'OidcProvider.exceptions.InvalidRequest.DB2F8';
}
