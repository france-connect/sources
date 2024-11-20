/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidTarget_28AB_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '28AB';
  static ERROR_CLASS = 'InvalidTarget';
  static ERROR_DETAIL = 'resource indicator must be an absolute URI';
  static DOCUMENTATION = 'resource indicator must be an absolute URI';
  static ERROR_SOURCE = 'shared/check_resource.js:64';
  static UI = 'OidcProvider.exceptions.InvalidTarget.28AB';
}
