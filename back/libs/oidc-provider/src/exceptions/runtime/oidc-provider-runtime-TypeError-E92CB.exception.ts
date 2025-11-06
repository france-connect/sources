/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_E92CB_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'E92CB';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL =
    'registrationManagement is only available in conjuction with registration';
  static DOCUMENTATION =
    'registrationManagement is only available in conjuction with registration';
  static ERROR_SOURCE = 'helpers/configuration.js:353';
  static UI = 'OidcProvider.exceptions.TypeError.E92CB';
}
