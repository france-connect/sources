/* istanbul ignore file */

// Declarative code
import { Description, FcException } from '@fc/exceptions';

import { CsmrTracksErrorCode } from '../enums';

@Description(
  'Impossible to get data from tracks consumer, please check the consumer results',
)
export class CsmrAggregateTracksCsmrFailedException extends FcException {
  public readonly code = CsmrTracksErrorCode.CSMR_FAILED;
  public readonly message = 'Impossible to get data from tracks consumer';
}
