import { ErrorCode } from '../enums';
import { DatapassBaseException } from './datapass-base.exception';

export class DatapassTransformationException extends DatapassBaseException {
  static CODE = ErrorCode.DATAPASS_TRANSFORMATION_FAILED;
  static DOCUMENTATION =
    'Échec de la transformation du payload webhook Datapass';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION = 'Failed to transform Datapass webhook payload';
  static UI = 'Datapass.exceptions.transformationFailed';
}
