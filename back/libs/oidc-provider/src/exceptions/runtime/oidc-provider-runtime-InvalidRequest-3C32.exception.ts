/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_3C32_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '3C32';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'only ${cty} content-type bodies are supported on ${ctx.method} ${ctx.path}';
  static DOCUMENTATION =
    'only ${cty} content-type bodies are supported on ${ctx.method} ${ctx.path}';
  static ERROR_SOURCE = 'shared/selective_body.js:51';
  static UI = 'OidcProvider.exceptions.InvalidRequest.3C32';
}
