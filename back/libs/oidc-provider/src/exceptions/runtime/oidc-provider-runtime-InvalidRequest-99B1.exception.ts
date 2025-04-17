/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_99B1_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '99B1';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'unrecognized route or not allowed method (${ctx.method} on ${ctx.path}), 404';
  static DOCUMENTATION =
    'unrecognized route or not allowed method (${ctx.method} on ${ctx.path}), 404';
  static ERROR_SOURCE = 'helpers/initialize_app.js:227';
  static UI = 'OidcProvider.exceptions.InvalidRequest.99B1';
}
