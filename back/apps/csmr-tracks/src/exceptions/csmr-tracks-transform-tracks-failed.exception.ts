/* istanbul ignore file */

// Declarative code

import { Description } from '@fc/exceptions-deprecated';

import { CsmrTracksErrorCode } from '../enums';
import { CsmrTracksBaseException } from './csmr-tracks-base.exception';

@Description(
  'Impossible to transform tracks, something went wrong during mapping process',
)
export class CsmrTracksTransformTracksFailedException extends CsmrTracksBaseException {
  public readonly code = CsmrTracksErrorCode.TRANSFORM_TRACKS_FAILED;
  public readonly message = 'Impossible to transform tracks';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
