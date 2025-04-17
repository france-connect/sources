/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequestUri_6805_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '6805';
  static ERROR_CLASS = 'InvalidRequestUri';
  static ERROR_DETAIL = 'request_uri is invalid, expired, or was already used';
  static DOCUMENTATION = 'request_uri is invalid, expired, or was already used';
  static ERROR_SOURCE = 'actions/authorization/respond.js:24';
  static UI = 'OidcProvider.exceptions.InvalidRequestUri.6805';
}
