/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_44FD_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '44FD';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    '${formatters.formatList(params)} ${formatters.pluralize(parameter, params.length)} must not be provided twice';
  static DOCUMENTATION =
    '${formatters.formatList(params)} ${formatters.pluralize(parameter, params.length)} must not be provided twice';
  static ERROR_SOURCE = 'shared/reject_dupes.js:40';
  static UI = 'OidcProvider.exceptions.InvalidRequest.44FD';
}
