/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_6681_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '6681';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'access token must only be provided using one mechanism';
  static DOCUMENTATION =
    'access token must only be provided using one mechanism';
  static ERROR_SOURCE = 'helpers/oidc_context.js:240';
  static UI = 'OidcProvider.exceptions.InvalidRequest.6681';
}
