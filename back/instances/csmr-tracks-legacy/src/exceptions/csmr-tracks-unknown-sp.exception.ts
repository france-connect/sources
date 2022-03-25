/* istanbul ignore file */

// Declarative code
import { CsmrTracksErrorCode } from '@fc/csmr-tracks';
import { Description, FcException } from '@fc/exceptions';

@Description('Unknown Service Provider for tracks event to find name')
export class CsmrTracksUnknownSpException extends FcException {
  public readonly code = CsmrTracksErrorCode.UNKNOWN_SP;
  public readonly message = 'Unknown service provider for tracks event';
}
