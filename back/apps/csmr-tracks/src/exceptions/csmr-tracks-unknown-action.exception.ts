/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { CsmrTracksErrorCode } from '../enums';
import { CsmrTracksBaseException } from './csmr-tracks-base.exception';

@Description('Unknown Action/TypeAction for tracks event')
export class CsmrTracksUnknownActionException extends CsmrTracksBaseException {
  public readonly code = CsmrTracksErrorCode.UNKNOWN_ACTION;
  public readonly message = 'Unknown Action/TypeAction for tracks event';
}
