/* istanbul ignore file */

// declarative file
import { Description } from '@fc/exceptions';

import { DataProviderCoreAuthBaseException } from './data-provider-core-auth-base.exception';

@Description('Les scopes du token ne correspondent pas à ceux configurés')
export class ReceivedInvalidScopeException extends DataProviderCoreAuthBaseException {
  code = 4;
}
