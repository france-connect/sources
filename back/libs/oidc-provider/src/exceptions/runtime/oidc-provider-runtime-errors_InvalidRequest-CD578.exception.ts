/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_errors_InvalidRequest_CD578_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'CD578';
  static ERROR_CLASS = 'errors_InvalidRequest';
  static ERROR_DETAIL =
    'authorization_details is unsupported for this grant_type';
  static DOCUMENTATION =
    'authorization_details is unsupported for this grant_type';
  static ERROR_SOURCE = 'actions/grants/ciba.js:24';
  static UI = 'OidcProvider.exceptions.errors_InvalidRequest.CD578';
}
