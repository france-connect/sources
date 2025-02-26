/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_ED11_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'ED11';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'authorization header scheme must be "DPoP" when DPoP is used';
  static DOCUMENTATION =
    'authorization header scheme must be "DPoP" when DPoP is used';
  static ERROR_SOURCE = 'helpers/oidc_context.js:258';
  static UI = 'OidcProvider.exceptions.InvalidRequest.ED11';
}
