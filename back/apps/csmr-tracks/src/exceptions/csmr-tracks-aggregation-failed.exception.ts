/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { CsmrTracksErrorCode } from '../enums';
import { CsmrTracksBaseException } from './csmr-tracks-base.exception';

@Description(
  'Impossible to aggregate the tracks, please check the consumer results',
)
export class CsmrTracksAggregationFailedException extends CsmrTracksBaseException {
  public readonly code = CsmrTracksErrorCode.AGGREGATION_FAILED;
  public readonly message = 'Impossible to aggregate tracks';
}
