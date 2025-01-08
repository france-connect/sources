/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidTarget_274E_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '274E';
  static ERROR_CLASS = 'InvalidTarget';
  static ERROR_DETAIL =
    'only a single resource indicator value must be requested/resolved during Access Token Request';
  static DOCUMENTATION =
    'only a single resource indicator value must be requested/resolved during Access Token Request';
  static ERROR_SOURCE = 'actions/authorization/process_response_types.js:30';
  static UI = 'OidcProvider.exceptions.InvalidTarget.274E';
}
