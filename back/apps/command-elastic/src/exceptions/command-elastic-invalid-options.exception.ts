import { ErrorCode } from '../enums';
import { CommandElasticBaseException } from './command-elastic-base.exception';

export class CommandElasticInvalidOptionsException extends CommandElasticBaseException {
  static CODE = ErrorCode.INVALID_OPTIONS;
  static DOCUMENTATION =
    'Les options passées à la commande ne passent pas la validation DTO';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION = 'Command Elasticsearch options validation failed';
  static UI = 'CommandElastic.exceptions.commandElasticInvalidOptions';
}
