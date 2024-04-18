/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions-deprecated';

import { CsmrTracksErrorCode } from '../enums';
import { CsmrTracksBaseException } from './csmr-tracks-base.exception';

@Description('Unknown Action/TypeAction for tracks event')
export class CsmrTracksUnknownActionException extends CsmrTracksBaseException {
  public readonly code = CsmrTracksErrorCode.UNKNOWN_ACTION;
  public readonly message = 'Unknown Action/TypeAction for tracks event';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
