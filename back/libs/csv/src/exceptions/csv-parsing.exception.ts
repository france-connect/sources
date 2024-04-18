/* istanbul ignore file */

// Declarative code

import { Description, Loggable } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { CsvBaseException } from './csv-base.exception';

@Loggable()
@Description("Problème d'extraction des données CSV")
export class CsvParsingException extends CsvBaseException {
  code = ErrorCode.PARSING_CSV;
  message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
