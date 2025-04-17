/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_E8F4_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'E8F4';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL = 'subjectTypes must not be empty';
  static DOCUMENTATION = 'subjectTypes must not be empty';
  static ERROR_SOURCE = 'helpers/configuration.js:343';
  static UI = 'OidcProvider.exceptions.TypeError.E8F4';
}
