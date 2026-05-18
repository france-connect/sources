import { ErrorCode } from '../enums';
import { DatapassBaseException } from './datapass-base.exception';

export class DatapassEidasLevelException extends DatapassBaseException {
  static CODE = ErrorCode.DATAPASS_EIDAS_LEVEL_FAILED;
  static DOCUMENTATION =
    'Mauvaise valeur pour le niveau eIDAS du payload webhook Datapass';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'Invalid eIDAS level value in Datapass webhook payload';
  static UI = 'Datapass.exceptions.eidasLevelFailed';
}
