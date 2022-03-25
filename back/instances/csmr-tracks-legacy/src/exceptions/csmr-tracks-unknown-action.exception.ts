/* istanbul ignore file */

// Declarative code
import { CsmrTracksErrorCode } from '@fc/csmr-tracks';
import { Description, FcException } from '@fc/exceptions';

@Description('Unknown Action/TypeAction for tracks event')
export class CsmrTracksUnknownActionException extends FcException {
  public readonly code = CsmrTracksErrorCode.UNKNOWN_ACTION;
  public readonly message = 'Unknown Action/TypeAction for tracks event';
}
