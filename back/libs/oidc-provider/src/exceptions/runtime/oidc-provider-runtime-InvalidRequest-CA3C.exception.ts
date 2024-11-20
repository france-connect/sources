/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_CA3C_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'CA3C';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'client authentication must only be provided using one mechanism';
  static DOCUMENTATION =
    'client authentication must only be provided using one mechanism';
  static ERROR_SOURCE = 'shared/token_auth.js:94';
  static UI = 'OidcProvider.exceptions.InvalidRequest.CA3C';
}
