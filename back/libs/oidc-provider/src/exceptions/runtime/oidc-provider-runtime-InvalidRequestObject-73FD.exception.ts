/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequestObject_73FD_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '73FD';
  static ERROR_CLASS = 'InvalidRequestObject';
  static ERROR_DETAIL = 'Request Object is missing the exp claim';
  static DOCUMENTATION = 'Request Object is missing the exp claim';
  static ERROR_SOURCE = 'actions/authorization/process_request_object.js:171';
  static UI = 'OidcProvider.exceptions.InvalidRequestObject.73FD';
}
