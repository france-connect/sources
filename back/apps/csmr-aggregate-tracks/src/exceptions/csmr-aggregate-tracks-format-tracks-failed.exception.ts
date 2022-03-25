/* istanbul ignore file */

// Declarative code
import { Description, FcException } from '@fc/exceptions';

import { CsmrTracksErrorCode } from '../enums';

@Description(
  'Impossible to format the tracks, please check maybe the date params',
)
export class CsmrAggregateTracksFormatTracksFailedException extends FcException {
  public readonly code = CsmrTracksErrorCode.FORMAT_TRACKS_FAILED;
  public readonly message = 'Impossible to format tracks';
}
