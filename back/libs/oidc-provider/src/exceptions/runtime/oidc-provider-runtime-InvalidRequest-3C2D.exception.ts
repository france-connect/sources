/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_3C2D_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '3C2D';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'Encrypted Request Objects are not supported by CIBA';
  static DOCUMENTATION = 'Encrypted Request Objects are not supported by CIBA';
  static ERROR_SOURCE = 'actions/authorization/process_request_object.js:40';
  static UI = 'OidcProvider.exceptions.InvalidRequest.3C2D';
}
