/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_8017_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '8017';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'missing required ${formatters.pluralize(parameter, missing.length)} ${formatters.formatList(missing)}';
  static DOCUMENTATION =
    'missing required ${formatters.pluralize(parameter, missing.length)} ${formatters.formatList(missing)}';
  static ERROR_SOURCE = 'helpers/validate_presence.js:15';
  static UI = 'OidcProvider.exceptions.InvalidRequest.8017';
}
