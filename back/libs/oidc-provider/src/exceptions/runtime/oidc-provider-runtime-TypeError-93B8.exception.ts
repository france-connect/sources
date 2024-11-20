/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_93B8_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '93B8';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL =
    'registrationManagement is only available in conjuction with registration';
  static DOCUMENTATION =
    'registrationManagement is only available in conjuction with registration';
  static ERROR_SOURCE = 'helpers/configuration.js:380';
  static UI = 'OidcProvider.exceptions.TypeError.93B8';
}
