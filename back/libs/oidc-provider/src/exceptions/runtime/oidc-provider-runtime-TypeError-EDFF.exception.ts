/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_EDFF_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'EDFF';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL = 'only public and pairwise subjectTypes are supported';
  static DOCUMENTATION = 'only public and pairwise subjectTypes are supported';
  static ERROR_SOURCE = 'helpers/configuration.js:333';
  static UI = 'OidcProvider.exceptions.TypeError.EDFF';
}
