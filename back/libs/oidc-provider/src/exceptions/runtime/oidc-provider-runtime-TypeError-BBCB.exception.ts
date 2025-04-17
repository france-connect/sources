/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_BBCB_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'BBCB';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL = 'dynamic format must be configured as a function';
  static DOCUMENTATION = 'dynamic format must be configured as a function';
  static ERROR_SOURCE = 'models/mixins/has_format.js:24';
  static UI = 'OidcProvider.exceptions.TypeError.BBCB';
}
