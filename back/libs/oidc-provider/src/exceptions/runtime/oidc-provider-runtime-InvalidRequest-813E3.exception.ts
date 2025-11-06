/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_813E3_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '813E3';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    '"DPoP" tokens must be provided via an authorization header';
  static DOCUMENTATION =
    '"DPoP" tokens must be provided via an authorization header';
  static ERROR_SOURCE = 'helpers/oidc_context.js:276';
  static UI = 'OidcProvider.exceptions.InvalidRequest.813E3';
}
