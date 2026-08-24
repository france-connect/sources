import { ErrorCode } from '../enums';
import { ElasticControlBaseException } from './elastic-control-base.exception';

export class ElasticControlInvalidSemesterPeriodException extends ElasticControlBaseException {
  static CODE = ErrorCode.INVALID_SEMESTER_PERIOD;
  static DOCUMENTATION =
    'La période passée pour un semestre est invalide. Format attendu : YYYY-01 (S1) ou YYYY-07 (S2).';
  static ERROR = 'invalid_semester_period';
  static ERROR_DESCRIPTION =
    'The semester period is invalid. Expected format: YYYY-01 (S1) or YYYY-07 (S2).';
  static UI = 'ElasticControl.exceptions.elasticControlInvalidSemesterPeriod';
}
