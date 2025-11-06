/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_96E4A_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '96E4A';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    '${formatters.formatList(params)} ${formatters.pluralize("parameter", params.length)} must not be provided twice';
  static DOCUMENTATION =
    '${formatters.formatList(params)} ${formatters.pluralize("parameter", params.length)} must not be provided twice';
  static ERROR_SOURCE = 'shared/reject_dupes.js:41';
  static UI = 'OidcProvider.exceptions.InvalidRequest.96E4A';
}
