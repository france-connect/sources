/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { CsmrTracksErrorCode } from '../enums';
import { CsmrTracksBaseException } from './csmr-tracks-base.exception';

@Description(
  'Impossible to format the tracks, please check maybe the date params',
)
export class CsmrTracksFormatTracksFailedException extends CsmrTracksBaseException {
  public readonly code = CsmrTracksErrorCode.FORMAT_TRACKS_FAILED;
  public readonly message = 'Impossible to format tracks';
}
