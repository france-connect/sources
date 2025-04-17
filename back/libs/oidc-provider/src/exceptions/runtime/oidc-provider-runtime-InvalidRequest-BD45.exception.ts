/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_BD45_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'BD45';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL = 'post_logout_redirect_uri not registered';
  static DOCUMENTATION = 'post_logout_redirect_uri not registered';
  static ERROR_SOURCE = 'actions/end_session.js:67';
  static UI = 'OidcProvider.exceptions.InvalidRequest.BD45';
}
