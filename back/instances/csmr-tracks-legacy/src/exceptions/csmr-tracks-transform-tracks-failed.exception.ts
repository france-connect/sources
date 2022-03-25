/* istanbul ignore file */

// Declarative code
import { CsmrTracksErrorCode } from '@fc/csmr-tracks';
import { Description, FcException } from '@fc/exceptions';

@Description(
  'Impossible to transform tracks, something went wrong during mapping process',
)
export class CsmrTracksTransformTracksFailedException extends FcException {
  public readonly code = CsmrTracksErrorCode.TRANSFORM_TRACKS_FAILED;
  public readonly message = 'Impossible to transform tracks';
}
