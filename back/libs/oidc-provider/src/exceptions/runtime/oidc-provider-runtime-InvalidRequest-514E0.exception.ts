/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_514E0_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '514E0';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'access token must only be provided using one mechanism';
  static DOCUMENTATION =
    'access token must only be provided using one mechanism';
  static ERROR_SOURCE = 'helpers/oidc_context.js:247';
  static UI = 'OidcProvider.exceptions.InvalidRequest.514E0';
}
