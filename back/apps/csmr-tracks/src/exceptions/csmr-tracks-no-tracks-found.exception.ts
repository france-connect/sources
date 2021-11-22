/* istanbul ignore file */

// Declarative code
import { Description, FcException } from '@fc/exceptions';

import { CsmrTracksErrorCode } from '../enums';

@Description('No tracks found in Elasticsearch database for this account')
export class CsrmTracksNoTracksException extends FcException {
  public readonly code = CsmrTracksErrorCode.NOT_TRACKS_FOUND;

  constructor(error?: Error) {
    super(error);
    this.message = 'no tracks found';
  }
}
