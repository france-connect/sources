/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidTarget_7045_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '7045';
  static ERROR_CLASS = 'InvalidTarget';
  static ERROR_DETAIL = 'only a single audience value is supported';
  static DOCUMENTATION = 'only a single audience value is supported';
  static ERROR_SOURCE = 'models/mixins/set_audience.js:10';
  static UI = 'OidcProvider.exceptions.InvalidTarget.7045';
}
