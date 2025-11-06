/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_6177F_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '6177F';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'Encrypted Request Objects are not supported by CIBA';
  static DOCUMENTATION = 'Encrypted Request Objects are not supported by CIBA';
  static ERROR_SOURCE = 'actions/authorization/process_request_object.js:39';
  static UI = 'OidcProvider.exceptions.InvalidRequest.6177F';
}
