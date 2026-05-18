import { ErrorCode } from '../enums';
import { DatapassBaseException } from './datapass-base.exception';

export class DatapassPaginationLimitExceededException extends DatapassBaseException {
  static CODE = ErrorCode.DATAPASS_PAGINATION_LIMIT_EXCEEDED;
  static DOCUMENTATION =
    "Le nombre maximal d'itérations de pagination de l'API Datapass a été dépassé, possible boucle API";
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'Datapass API pagination limit exceeded, possible API loop';
  static UI = 'Datapass.exceptions.paginationLimitExceeded';
}
