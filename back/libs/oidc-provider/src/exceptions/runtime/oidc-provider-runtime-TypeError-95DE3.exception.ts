/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_95DE3_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '95DE3';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL =
    'persist can only be called on previously persisted Interactions';
  static DOCUMENTATION =
    'persist can only be called on previously persisted Interactions';
  static ERROR_SOURCE = 'models/interaction.js:52';
  static UI = 'OidcProvider.exceptions.TypeError.95DE3';
}
