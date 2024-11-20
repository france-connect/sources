/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_F1D5_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'F1D5';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'could not find logout details';
  static DOCUMENTATION = 'could not find logout details';
  static ERROR_SOURCE = 'actions/end_session.js:118';
  static UI = 'OidcProvider.exceptions.InvalidRequest.F1D5';
}
