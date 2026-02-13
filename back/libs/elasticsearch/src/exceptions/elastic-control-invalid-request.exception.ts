import { ErrorCode } from '../enums';
import { ElasticControlBaseException } from './elastic-control-base.exception';

export class ElasticControlInvalidRequestException extends ElasticControlBaseException {
  static CODE = ErrorCode.INVALID_REQUEST;
  static DOCUMENTATION = 'La requête au serveur elastic a échoué';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'The Elasticsearch request failed due to a technical error';
  static UI = 'ElasticControl.exceptions.elasticControlInvalidRequest';
}
