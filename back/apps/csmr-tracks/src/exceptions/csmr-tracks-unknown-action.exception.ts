import { CsmrTracksErrorCode } from '../enums';
import { CsmrTracksBaseException } from './csmr-tracks-base.exception';

export class CsmrTracksUnknownActionException extends CsmrTracksBaseException {
  static CODE = CsmrTracksErrorCode.UNKNOWN_ACTION;
  static DOCUMENTATION = 'Unknown Action/TypeAction for tracks event';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'CsmrTracks.exceptions.csmrTracksUnknownAction';
}
