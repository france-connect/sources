/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_A5AF_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'A5AF';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL =
    'registrationManagement is only available in conjuction with registration';
  static DOCUMENTATION =
    'registrationManagement is only available in conjuction with registration';
  static ERROR_SOURCE = 'helpers/configuration.js:397';
  static UI = 'OidcProvider.exceptions.TypeError.A5AF';
}
