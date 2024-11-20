/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_6677_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '6677';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'this token does not belong to you';
  static DOCUMENTATION = 'this token does not belong to you';
  static ERROR_SOURCE = 'actions/revocation.js:110';
  static UI = 'OidcProvider.exceptions.InvalidRequest.6677';
}
