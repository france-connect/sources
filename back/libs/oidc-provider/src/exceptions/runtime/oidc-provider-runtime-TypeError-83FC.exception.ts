/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_83FC_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '83FC';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL =
    'invalid extraParams.${key} type, it must be a function, null, or undefined';
  static DOCUMENTATION =
    'invalid extraParams.${key} type, it must be a function, null, or undefined';
  static ERROR_SOURCE = 'helpers/configuration.js:132';
  static UI = 'OidcProvider.exceptions.TypeError.83FC';
}
