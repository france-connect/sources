/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidScope_9512A_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '9512A';
  static ERROR_CLASS = 'InvalidScope';
  static ERROR_DETAIL =
    '"refresh token missing requested ${formatters.pluralize("scope", missing.length)}", missing.join(" ")';
  static DOCUMENTATION =
    '"refresh token missing requested ${formatters.pluralize("scope", missing.length)}", missing.join(" ")';
  static ERROR_SOURCE = 'actions/grants/refresh_token.js:98';
  static UI = 'OidcProvider.exceptions.InvalidScope.9512A';
}
