/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { CsmrTracksErrorCode } from '../enums';
import { CsmrTracksBaseException } from './csmr-tracks-base.exception';

@Description(
  'Impossible to get data from tracks consumer, please check the consumer results',
)
export class CsmrTracksCsmrFailedException extends CsmrTracksBaseException {
  public readonly code = CsmrTracksErrorCode.CSMR_FAILED;
  public readonly message = 'Impossible to get data from tracks consumer';
}
