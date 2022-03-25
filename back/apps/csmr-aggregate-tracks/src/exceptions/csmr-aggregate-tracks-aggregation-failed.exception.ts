/* istanbul ignore file */

// Declarative code
import { Description, FcException } from '@fc/exceptions';

import { CsmrTracksErrorCode } from '../enums';

@Description(
  'Impossible to aggregate the tracks, please check the consumer results',
)
export class CsmrAggregateTracksAggregationFailedException extends FcException {
  public readonly code = CsmrTracksErrorCode.AGGREGATION_FAILED;
  public readonly message = 'Impossible to aggregate tracks';
}
