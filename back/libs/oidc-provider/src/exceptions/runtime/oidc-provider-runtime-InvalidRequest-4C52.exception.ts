/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_4C52_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '4C52';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'could not find logout details';
  static DOCUMENTATION = 'could not find logout details';
  static ERROR_SOURCE = 'actions/end_session.js:117';
  static UI = 'OidcProvider.exceptions.InvalidRequest.4C52';
}
