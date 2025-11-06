/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_EDA40_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'EDA40';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL = '"resource" must be a string';
  static DOCUMENTATION = '"resource" must be a string';
  static ERROR_SOURCE = 'models/grant.js:112';
  static UI = 'OidcProvider.exceptions.TypeError.EDA40';
}
