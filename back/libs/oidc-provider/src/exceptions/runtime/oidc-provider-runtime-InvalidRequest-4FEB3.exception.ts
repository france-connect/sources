/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_4FEB3_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '4FEB3';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'no client authentication mechanism provided';
  static DOCUMENTATION = 'no client authentication mechanism provided';
  static ERROR_SOURCE = 'shared/client_auth.js:144';
  static UI = 'OidcProvider.exceptions.InvalidRequest.4FEB3';
}
