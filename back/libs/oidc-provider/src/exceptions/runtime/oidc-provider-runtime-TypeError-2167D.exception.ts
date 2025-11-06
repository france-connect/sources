/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_2167D_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '2167D';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL =
    'invalid extraParams.${key} type, it must be a function, null, or undefined';
  static DOCUMENTATION =
    'invalid extraParams.${key} type, it must be a function, null, or undefined';
  static ERROR_SOURCE = 'helpers/configuration.js:100';
  static UI = 'OidcProvider.exceptions.TypeError.2167D';
}
