/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_52FF5_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '52FF5';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = '"DPoP" header not provided';
  static DOCUMENTATION = '"DPoP" header not provided';
  static ERROR_SOURCE = 'helpers/oidc_context.js:267';
  static UI = 'OidcProvider.exceptions.InvalidRequest.52FF5';
}
