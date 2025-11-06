/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_66776_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '66776';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'this token does not belong to you';
  static DOCUMENTATION = 'this token does not belong to you';
  static ERROR_SOURCE = 'actions/revocation.js:110';
  static UI = 'OidcProvider.exceptions.InvalidRequest.66776';
}
