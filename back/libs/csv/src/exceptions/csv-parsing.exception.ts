/* istanbul ignore file */

// Declarative code

import { Description, Loggable } from '@fc/exceptions';

import { CsvBaseException } from './csv-base.exception';

@Loggable()
@Description("Problème d'extraction des données CSV")
export class CsvParsingException extends CsvBaseException {
  code = 0;
  message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';
}
